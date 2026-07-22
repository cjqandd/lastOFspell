import { readFile, writeFile } from "node:fs/promises";

const rulesUrl = new URL("./GAME_RULES.md", import.meta.url);
const outputUrl = new URL("./game-config.js", import.meta.url);
const markdown = await readFile(rulesUrl, "utf8");
const match = markdown.match(/<!-- GAME_CONFIG_START -->\s*```json\s*([\s\S]*?)\s*```\s*<!-- GAME_CONFIG_END -->/);

if (!match) {
  throw new Error("GAME_RULES.md 中缺少完整的可编辑数值区。");
}

let source;
try {
  source = JSON.parse(match[1]);
} catch (error) {
  throw new Error(`GAME_RULES.md 的可编辑数值区不是有效 JSON：${error.message}`);
}

const fail = message => { throw new Error(`游戏配置错误：${message}`); };
const number = (value, label) => {
  if (!Number.isFinite(value)) fail(`${label} 必须是数字`);
  return value;
};
const teamMap = { "我方": "p", "敌方": "e" };
const shapeMap = { "直线": "line", "菱形": "diamond" };
const targetMap = { "单个敌人": "enemy", "落点": "tile" };
const skillKeyMap = { "技能1": "skill1", "技能2": "skill2" };

const mapSize = number(source["地图"]?.["地图尺寸"], "地图.地图尺寸");
if (!Number.isInteger(mapSize) || mapSize < 1) fail("地图.地图尺寸必须是正整数");
if (!Array.isArray(source["单位"]) || !source["单位"].length) fail("单位必须至少包含一个单位");
if (!Array.isArray(source["障碍物"])) fail("障碍物必须是数组");
if (!source["技能"] || typeof source["技能"] !== "object") fail("技能必须是对象");

let playerNumber = 0, enemyNumber = 0;
const units = source["单位"].map(unit => {
  const team = teamMap[unit["阵营"]];
  return {
    id: team === "p" ? `hero${++playerNumber}` : `enemy${++enemyNumber}`,
    name: unit["名称"],
    role: unit["职业"],
    team,
    x: number(unit["横坐标"], `${unit["名称"]}.横坐标`),
    y: number(unit["纵坐标"], `${unit["名称"]}.纵坐标`),
    attack: number(unit["攻击力"], `${unit["名称"]}.攻击力`),
    defense: number(unit["防御力"], `${unit["名称"]}.防御力`),
    hp: number(unit["生命值"], `${unit["名称"]}.生命值`),
    initiative: number(unit["先攻值"], `${unit["名称"]}.先攻值`),
    actionPoints: number(unit["行动力"], `${unit["名称"]}.行动力`)
  };
});

const ids = new Set();
const names = new Set();
for (const unit of units) {
  if (!unit.id || ids.has(unit.id)) fail(`单位 ID 重复或为空：${unit.id ?? ""}`);
  ids.add(unit.id);
  if (!unit.name || names.has(unit.name)) fail(`单位名称重复或为空：${unit.name ?? ""}`);
  names.add(unit.name);
  if (!unit.team) fail(`${unit.name} 的阵营只能填写“我方”或“敌方”`);
  if (unit.x < 0 || unit.x >= mapSize || unit.y < 0 || unit.y >= mapSize) fail(`${unit.name} 的初始坐标超出地图`);
}

const skills = {};
for (const [unitName, sourceSkills] of Object.entries(source["技能"])) {
  const unit = units.find(item => item.name === unitName);
  if (!unit) fail(`技能所属单位“${unitName}”不在单位列表中`);
  skills[unit.id] = {};
  for (const [skillLabel, skill] of Object.entries(sourceSkills)) {
    const skillKey = skillKeyMap[skillLabel];
    if (!skillKey) fail(`${unitName}.${skillLabel} 只能命名为“技能1”或“技能2”`);
    const shape = shapeMap[skill["范围形状"]];
    const target = targetMap[skill["目标类型"]];
    if (!shape) fail(`${unitName}.${skillLabel}.范围形状只能填写“直线”或“菱形”`);
    if (!target) fail(`${unitName}.${skillLabel}.目标类型只能填写“单个敌人”或“落点”`);
    skills[unit.id][skillKey] = {
      name: skill["名称"],
      range: number(skill["施法范围"], `${unitName}.${skillLabel}.施法范围`),
      shape,
      target,
      power: number(skill["伤害倍率"], `${unitName}.${skillLabel}.伤害倍率`),
      push: number(skill["击退格数"], `${unitName}.${skillLabel}.击退格数`),
      damageType: skill["伤害类型"],
      ...(skill["效果半径"] === undefined ? {} : { area: number(skill["效果半径"], `${unitName}.${skillLabel}.效果半径`) }),
      description: skill["描述"]
    };
  }
}

const config = {
  schemaVersion: source["配置版本"],
  map: {
    size: mapSize,
    tileMeters: number(source["地图"]["每格米数"], "地图.每格米数")
  },
  visual: {
    initialZoom: number(source["画面"]?.["初始缩放"], "画面.初始缩放"),
    minimumZoom: number(source["画面"]?.["最小缩放"], "画面.最小缩放"),
    maximumZoom: number(source["画面"]?.["最大缩放"], "画面.最大缩放"),
    damageNumberDurationMs: number(source["画面"]?.["伤害数字持续毫秒"], "画面.伤害数字持续毫秒")
  },
  movement: {
    actionPointCostPerTile: number(source["移动"]?.["每格行动力消耗"], "移动.每格行动力消耗")
  },
  combat: {
    minimumDamage: number(source["战斗"]?.["最低伤害"], "战斗.最低伤害")
  },
  enemyAI: {
    turnStartDelayMs: number(source["敌人AI"]?.["行动开始等待毫秒"], "敌人AI.行动开始等待毫秒"),
    stepDelayMs: number(source["敌人AI"]?.["每格移动等待毫秒"], "敌人AI.每格移动等待毫秒"),
    turnEndDelayMs: number(source["敌人AI"]?.["行动结束等待毫秒"], "敌人AI.行动结束等待毫秒")
  },
  units,
  obstacles: source["障碍物"].map((item, index) => ({
    x: number(item["横坐标"], `障碍物${index + 1}.横坐标`),
    y: number(item["纵坐标"], `障碍物${index + 1}.纵坐标`),
    width: number(item["宽度"], `障碍物${index + 1}.宽度`),
    height: number(item["高度"], `障碍物${index + 1}.高度`)
  })),
  skills
};

if (config.movement.actionPointCostPerTile <= 0) fail("移动.每格行动力消耗必须大于 0");
if (config.combat.minimumDamage < 0) fail("战斗.最低伤害不能小于 0");

const output = `// 此文件由 GAME_RULES.md 自动生成，请勿直接修改。\nwindow.GAME_CONFIG = ${JSON.stringify(config, null, 2)};\n`;
await writeFile(outputUrl, output, "utf8");
console.log("规则与数值已同步到 game-config.js");
