import { readFile, writeFile } from "node:fs/promises";

const rulesUrl = new URL("./GAME_RULES.md", import.meta.url);
const outputUrl = new URL("./game-config.js", import.meta.url);
const markdown = await readFile(rulesUrl, "utf8");
const match = markdown.match(/<!-- GAME_CONFIG_START -->\s*```json\s*([\s\S]*?)\s*```\s*<!-- GAME_CONFIG_END -->/);

if (!match) {
  throw new Error("GAME_RULES.md 中缺少完整的可编辑数值区。");
}

let config;
try {
  config = JSON.parse(match[1]);
} catch (error) {
  throw new Error(`GAME_RULES.md 的可编辑数值区不是有效 JSON：${error.message}`);
}

const fail = message => { throw new Error(`游戏配置错误：${message}`); };
if (!Number.isInteger(config.map?.size) || config.map.size < 1) fail("map.size 必须是正整数");
if (!Array.isArray(config.units) || !config.units.length) fail("units 必须至少包含一个单位");
if (!Array.isArray(config.obstacles)) fail("obstacles 必须是数组");
if (!config.skills || typeof config.skills !== "object") fail("skills 必须是对象");
if (!Number.isFinite(config.movement?.actionPointCostPerTile) || config.movement.actionPointCostPerTile <= 0) fail("movement.actionPointCostPerTile 必须大于 0");
if (!Number.isFinite(config.combat?.minimumDamage) || config.combat.minimumDamage < 0) fail("combat.minimumDamage 不能小于 0");

const ids = new Set();
for (const unit of config.units) {
  if (!unit.id || ids.has(unit.id)) fail(`单位 ID 重复或为空：${unit.id ?? ""}`);
  ids.add(unit.id);
  if (!['p', 'e'].includes(unit.team)) fail(`${unit.id} 的 team 只能是 p 或 e`);
  for (const key of ['x', 'y', 'attack', 'defense', 'hp', 'initiative', 'actionPoints']) {
    if (!Number.isFinite(unit[key])) fail(`${unit.id}.${key} 必须是数字`);
  }
  if (unit.x < 0 || unit.x >= config.map.size || unit.y < 0 || unit.y >= config.map.size) fail(`${unit.id} 的初始坐标超出地图`);
}

const output = `// 此文件由 GAME_RULES.md 自动生成，请勿直接修改。\nwindow.GAME_CONFIG = ${JSON.stringify(config, null, 2)};\n`;
await writeFile(outputUrl, output, "utf8");
console.log("规则与数值已同步到 game-config.js");
