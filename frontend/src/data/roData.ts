export interface RoServer {
  name: string;
  type: 'OFFICIAL' | 'PRIVATE';
  region: string;
}

export const RO_SERVERS: RoServer[] = [
  // 공식 서버
  { name: 'iRO Renewal', type: 'OFFICIAL', region: 'NA' },
  { name: 'kRO', type: 'OFFICIAL', region: 'KR' },
  { name: 'jRO', type: 'OFFICIAL', region: 'JP' },
  { name: 'pRO', type: 'OFFICIAL', region: 'SEA' },
  { name: 'thRO', type: 'OFFICIAL', region: 'SEA' },
  { name: 'idRO', type: 'OFFICIAL', region: 'SEA' },
  // 프라이빗 서버
  { name: 'NovaRO', type: 'PRIVATE', region: 'GLOBAL' },
  { name: 'OriginsRO', type: 'PRIVATE', region: 'GLOBAL' },
  { name: 'ShiningMoon', type: 'PRIVATE', region: 'GLOBAL' },
  { name: 'TalonRO', type: 'PRIVATE', region: 'GLOBAL' },
];

export interface JobNode {
  name: string;
  tier: string;
  role: string;
  children?: JobNode[];
}

export const JOB_TREE: JobNode[] = [
  {
    name: 'Swordsman', tier: 'FIRST', role: 'TANK',
    children: [
      { name: 'Knight', tier: 'SECOND', role: 'TANK', children: [
        { name: 'Lord Knight', tier: 'TRANSCENDENT', role: 'TANK', children: [
          { name: 'Rune Knight', tier: 'THIRD', role: 'TANK', children: [
            { name: 'Dragon Knight', tier: 'FOURTH', role: 'TANK' }
          ]}
        ]}
      ]},
      { name: 'Crusader', tier: 'SECOND', role: 'TANK', children: [
        { name: 'Paladin', tier: 'TRANSCENDENT', role: 'TANK', children: [
          { name: 'Royal Guard', tier: 'THIRD', role: 'TANK', children: [
            { name: 'Imperial Guard', tier: 'FOURTH', role: 'TANK' }
          ]}
        ]}
      ]},
    ]
  },
  {
    name: 'Acolyte', tier: 'FIRST', role: 'SUPPORT',
    children: [
      { name: 'Priest', tier: 'SECOND', role: 'SUPPORT', children: [
        { name: 'High Priest', tier: 'TRANSCENDENT', role: 'SUPPORT', children: [
          { name: 'Arch Bishop', tier: 'THIRD', role: 'SUPPORT', children: [
            { name: 'Cardinal', tier: 'FOURTH', role: 'SUPPORT' }
          ]}
        ]}
      ]},
      { name: 'Monk', tier: 'SECOND', role: 'DPS_MELEE', children: [
        { name: 'Champion', tier: 'TRANSCENDENT', role: 'DPS_MELEE', children: [
          { name: 'Sura', tier: 'THIRD', role: 'DPS_MELEE', children: [
            { name: 'Inquisitor', tier: 'FOURTH', role: 'DPS_MELEE' }
          ]}
        ]}
      ]},
    ]
  },
  {
    name: 'Mage', tier: 'FIRST', role: 'DPS_MAGIC',
    children: [
      { name: 'Wizard', tier: 'SECOND', role: 'DPS_MAGIC', children: [
        { name: 'High Wizard', tier: 'TRANSCENDENT', role: 'DPS_MAGIC', children: [
          { name: 'Warlock', tier: 'THIRD', role: 'DPS_MAGIC', children: [
            { name: 'Arch Mage', tier: 'FOURTH', role: 'DPS_MAGIC' }
          ]}
        ]}
      ]},
      { name: 'Sage', tier: 'SECOND', role: 'DPS_MAGIC', children: [
        { name: 'Professor', tier: 'TRANSCENDENT', role: 'DPS_MAGIC', children: [
          { name: 'Sorcerer', tier: 'THIRD', role: 'DPS_MAGIC', children: [
            { name: 'Elemental Master', tier: 'FOURTH', role: 'DPS_MAGIC' }
          ]}
        ]}
      ]},
    ]
  },
  {
    name: 'Archer', tier: 'FIRST', role: 'DPS_RANGED',
    children: [
      { name: 'Hunter', tier: 'SECOND', role: 'DPS_RANGED', children: [
        { name: 'Sniper', tier: 'TRANSCENDENT', role: 'DPS_RANGED', children: [
          { name: 'Ranger', tier: 'THIRD', role: 'DPS_RANGED', children: [
            { name: 'Wind Hawk', tier: 'FOURTH', role: 'DPS_RANGED' }
          ]}
        ]}
      ]},
      { name: 'Bard/Dancer', tier: 'SECOND', role: 'SUPPORT', children: [
        { name: 'Clown/Gypsy', tier: 'TRANSCENDENT', role: 'SUPPORT', children: [
          { name: 'Maestro/Wanderer', tier: 'THIRD', role: 'SUPPORT', children: [
            { name: 'Troubadour/Trouvere', tier: 'FOURTH', role: 'SUPPORT' }
          ]}
        ]}
      ]},
    ]
  },
  {
    name: 'Thief', tier: 'FIRST', role: 'DPS_MELEE',
    children: [
      { name: 'Assassin', tier: 'SECOND', role: 'DPS_MELEE', children: [
        { name: 'Assassin Cross', tier: 'TRANSCENDENT', role: 'DPS_MELEE', children: [
          { name: 'Guillotine Cross', tier: 'THIRD', role: 'DPS_MELEE', children: [
            { name: 'Shadow Cross', tier: 'FOURTH', role: 'DPS_MELEE' }
          ]}
        ]}
      ]},
      { name: 'Rogue', tier: 'SECOND', role: 'DPS_MELEE', children: [
        { name: 'Stalker', tier: 'TRANSCENDENT', role: 'DPS_MELEE', children: [
          { name: 'Shadow Chaser', tier: 'THIRD', role: 'DPS_MELEE', children: [
            { name: 'Abyss Chaser', tier: 'FOURTH', role: 'DPS_MELEE' }
          ]}
        ]}
      ]},
    ]
  },
  {
    name: 'Merchant', tier: 'FIRST', role: 'UTILITY',
    children: [
      { name: 'Blacksmith', tier: 'SECOND', role: 'UTILITY', children: [
        { name: 'Whitesmith', tier: 'TRANSCENDENT', role: 'UTILITY', children: [
          { name: 'Mechanic', tier: 'THIRD', role: 'UTILITY', children: [
            { name: 'Meister', tier: 'FOURTH', role: 'UTILITY' }
          ]}
        ]}
      ]},
      { name: 'Alchemist', tier: 'SECOND', role: 'UTILITY', children: [
        { name: 'Biochemist', tier: 'TRANSCENDENT', role: 'UTILITY', children: [
          { name: 'Geneticist', tier: 'THIRD', role: 'UTILITY', children: [
            { name: 'Biolo', tier: 'FOURTH', role: 'UTILITY' }
          ]}
        ]}
      ]},
    ]
  },
];

// 직업 트리에서 모든 잎을 flat하게 추출
export function flattenJobs(nodes: JobNode[]): { name: string; tier: string; role: string; path: string }[] {
  const result: { name: string; tier: string; role: string; path: string }[] = [];
  function walk(node: JobNode, path: string) {
    const fullPath = path ? `${path} → ${node.name}` : node.name;
    if (!node.children || node.children.length === 0) {
      result.push({ name: node.name, tier: node.tier, role: node.role, path: fullPath });
    } else {
      result.push({ name: node.name, tier: node.tier, role: node.role, path: fullPath });
      for (const child of node.children) {
        walk(child, fullPath);
      }
    }
  }
  for (const root of nodes) walk(root, '');
  return result;
}

export const CONTENT_TYPES = [
  { value: 'LEVELING', label: '레벨링', emoji: '📈' },
  { value: 'WOE', label: 'WoE (길드전)', emoji: '🏰' },
  { value: 'MVP_HUNT', label: 'MVP 사냥', emoji: '🐉' },
  { value: 'INSTANCE_DUNGEON', label: '인스턴스 던전', emoji: '🏛️' },
  { value: 'PVP', label: 'PvP', emoji: '⚔️' },
  { value: 'SOCIAL', label: '소셜/채팅', emoji: '💬' },
];

export const ROLE_LABELS: Record<string, { label: string; emoji: string }> = {
  TANK: { label: '탱커', emoji: '🛡️' },
  DPS_MELEE: { label: '근접 딜러', emoji: '🗡️' },
  DPS_RANGED: { label: '원거리 딜러', emoji: '🏹' },
  DPS_MAGIC: { label: '마법 딜러', emoji: '🔮' },
  SUPPORT: { label: '서포트', emoji: '💚' },
  UTILITY: { label: '유틸리티', emoji: '⚒️' },
};

export const TIER_LABELS: Record<string, string> = {
  FIRST: '1차', SECOND: '2차', TRANSCENDENT: '전직', THIRD: '3차', FOURTH: '4차',
};
