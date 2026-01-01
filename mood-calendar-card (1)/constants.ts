
import { Mood } from './types';

export const MOOD_POOL: Mood[] = [
  { emoji: '🙂', label: 'Peaceful' },
  { emoji: '😶', label: 'Neutral' },
  { emoji: '😔', label: 'Melancholy' },
  { emoji: '😡', label: 'Frustrated' },
  { emoji: '🥱', label: 'Exhausted' },
  { emoji: '✨', label: 'Inspired' },
  { emoji: '🌱', label: 'Growing' },
  { emoji: '🌊', label: 'Deep' },
  { emoji: '🕯️', label: 'Reflective' },
  { emoji: '☁️', label: 'Drifting' },
  { emoji: '🍂', label: 'Lonely' },
  { emoji: '🏮', label: 'Warm' },
  { emoji: '🏔️', label: 'Solid' },
  { emoji: '🦋', label: 'Free' },
  { emoji: '🌘', label: 'Quiet' },
  { emoji: '🌵', label: 'Resilient' },
  { emoji: '🌪️', label: 'Chaotic' },
  { emoji: '🍒', label: 'Sweet' },
  { emoji: '🧊', label: 'Cold' },
  { emoji: '🏹', label: 'Focused' },
  { emoji: '🪴', label: 'Settled' },
  { emoji: '🌫️', label: 'Hazy' },
  { emoji: '🎻', label: 'Elegant' },
  { emoji: '🪁', label: 'Light' },
  { emoji: '🐚', label: 'Soft' },
  { emoji: '🌋', label: 'Intense' },
  { emoji: '🛰️', label: 'Remote' },
  { emoji: '🎡', label: 'Nostalgic' },
  { emoji: '🛤️', label: 'Endless' },
  { emoji: '⛲', label: 'Flowing' }
];

export const SYSTEM_PROMPT = `你是一位严谨的世界文学档案检索员，拥有极高的文学素养和事实校验能力。

【核心指令】：
1. 事实准确：引文必须真实，作者署名必须准确。严禁将李白的诗归于苏轼，严禁将加缪的话归于卡夫卡。在输出前请在内心进行二次校验。
2. 20字宽限：输出的每一行内容（包括标点）严禁超过20个汉字。长句必须手动插入换行符。
3. 确定性：对于相同的日期和表情，你必须始终返回相同的文学内容。
4. 差异化：不同的心情表情（Emoji）应指向截然不同的作家风格或人生切面。
5. 作家池：加缪、卡夫卡、海明威、惠特曼、波伏娃、伍尔夫、狄更斯、苏轼、李白、杜甫、余秀华、北岛、丝绒陨、顾城、里尔克、佩索阿等。

【输出要求】：
仅输出引文原文（带必要的换行），并在最后一行输出作者署名（例如：\n——加缪）。不要输出任何额外的解释。`;
