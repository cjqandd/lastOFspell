// 此文件由 GAME_RULES.md 自动生成，请勿直接修改。
window.GAME_CONFIG = {
  "schemaVersion": 1,
  "map": {
    "size": 60,
    "tileMeters": 1
  },
  "visual": {
    "initialZoom": 1,
    "minimumZoom": 0.55,
    "maximumZoom": 2,
    "damageNumberDurationMs": 900
  },
  "movement": {
    "actionPointCostPerTile": 1
  },
  "combat": {
    "minimumDamage": 1
  },
  "enemyAI": {
    "turnStartDelayMs": 210,
    "stepDelayMs": 90,
    "turnEndDelayMs": 120
  },
  "units": [
    {
      "id": "hero1",
      "name": "我高",
      "role": "战斗法师",
      "team": "p",
      "x": 30,
      "y": 29,
      "attack": 10,
      "defense": 5,
      "hp": 20,
      "initiative": 10,
      "actionPoints": 12
    },
    {
      "id": "hero2",
      "name": "我帅",
      "role": "盾卫",
      "team": "p",
      "x": 27,
      "y": 31,
      "attack": 10,
      "defense": 5,
      "hp": 20,
      "initiative": 10,
      "actionPoints": 12
    },
    {
      "id": "hero3",
      "name": "我强",
      "role": "远程法师",
      "team": "p",
      "x": 33,
      "y": 32,
      "attack": 10,
      "defense": 5,
      "hp": 20,
      "initiative": 10,
      "actionPoints": 12
    },
    {
      "id": "enemy1",
      "name": "屌丝1",
      "role": "敌对单位",
      "team": "e",
      "x": 25,
      "y": 22,
      "attack": 5,
      "defense": 5,
      "hp": 25,
      "initiative": 5,
      "actionPoints": 10
    },
    {
      "id": "enemy2",
      "name": "屌丝2",
      "role": "敌对单位",
      "team": "e",
      "x": 35,
      "y": 25,
      "attack": 5,
      "defense": 5,
      "hp": 25,
      "initiative": 5,
      "actionPoints": 10
    },
    {
      "id": "enemy3",
      "name": "屌丝3",
      "role": "敌对单位",
      "team": "e",
      "x": 39,
      "y": 31,
      "attack": 5,
      "defense": 5,
      "hp": 25,
      "initiative": 5,
      "actionPoints": 10
    },
    {
      "id": "enemy4",
      "name": "屌丝4",
      "role": "敌对单位",
      "team": "e",
      "x": 21,
      "y": 35,
      "attack": 5,
      "defense": 5,
      "hp": 25,
      "initiative": 5,
      "actionPoints": 10
    },
    {
      "id": "enemy5",
      "name": "屌丝5",
      "role": "敌对单位",
      "team": "e",
      "x": 31,
      "y": 38,
      "attack": 5,
      "defense": 5,
      "hp": 25,
      "initiative": 5,
      "actionPoints": 10
    },
    {
      "id": "enemy6",
      "name": "屌丝6",
      "role": "敌对单位",
      "team": "e",
      "x": 42,
      "y": 39,
      "attack": 5,
      "defense": 5,
      "hp": 25,
      "initiative": 5,
      "actionPoints": 10
    }
  ],
  "obstacles": [
    {
      "x": 28,
      "y": 27,
      "width": 3,
      "height": 2
    },
    {
      "x": 35,
      "y": 34,
      "width": 2,
      "height": 3
    },
    {
      "x": 24,
      "y": 32,
      "width": 2,
      "height": 2
    },
    {
      "x": 39,
      "y": 26,
      "width": 2,
      "height": 2
    },
    {
      "x": 30,
      "y": 35,
      "width": 2,
      "height": 2
    }
  ],
  "skills": {
    "hero1": {
      "skill1": {
        "name": "直接攻击",
        "range": 1,
        "shape": "line",
        "target": "enemy",
        "power": 1,
        "push": 0,
        "damageType": "物理",
        "description": "对上下左右 1 格内的单个敌人造成 100% 攻击力伤害。"
      },
      "skill2": {
        "name": "击退攻击",
        "range": 2,
        "shape": "line",
        "target": "enemy",
        "power": 0.8,
        "push": 2,
        "damageType": "物理",
        "description": "对上下左右 2 格内的单个敌人造成 80% 攻击力伤害，并击退 2 格。"
      }
    },
    "hero3": {
      "skill1": {
        "name": "魔法球",
        "range": 9,
        "shape": "diamond",
        "target": "enemy",
        "power": 0.8,
        "push": 0,
        "damageType": "魔法",
        "description": "选择 9 格内的单个敌人，造成 80% 攻击力伤害；不产生弹道和路径碰撞。"
      },
      "skill2": {
        "name": "魔力降临",
        "range": 9,
        "shape": "diamond",
        "target": "tile",
        "power": 0.5,
        "push": 0,
        "damageType": "魔法",
        "area": 1,
        "description": "选择 9 格内的一个落点，对以落点为中心的 3×3 区域内所有敌人造成 50% 攻击力伤害。"
      }
    }
  }
};
