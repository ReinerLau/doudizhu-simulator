/**
 * 对局数据类型定义
 */
export interface Game {
  /** 对局ID */
  id: number;
  /** 对局标题 */
  title: string;
}

/**
 * 模拟对局数据
 */
export const mockGames: Game[] = [
  { id: 1, title: "经典残局 - 春天" },
  { id: 2, title: "高级残局 - 反春" },
  { id: 3, title: "入门残局 - 基础出牌" },
  { id: 4, title: "困难残局 - 炸弹连环" },
  { id: 5, title: "中级残局 - 顺子组合" },
  { id: 6, title: "专家残局 - 王炸决胜" },
];
