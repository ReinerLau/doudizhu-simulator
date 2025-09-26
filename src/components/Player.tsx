import { Button } from "antd";
import { type PlayerType } from "../data/mockGames";
import { type CardValue } from "./Card";
import HandCards from "./HandCards";

/** 玩家显示名称映射 */
const playerDisplayNames: Record<PlayerType, string> = {
  landlord: "地主",
  farmer1: "下家",
  farmer2: "顶家",
};

/** Player 组件的属性接口 */
interface PlayerProps {
  /** 玩家类型 */
  playerType: PlayerType;
  /** 玩家手牌 */
  cards: CardValue[];
  /** 选中的手牌索引 */
  selectedIndexes: number[];
  /** 是否为当前轮次的玩家 */
  isCurrentPlayer: boolean;
  /** 是否为编辑模式 */
  isEditMode: boolean;
  /** 游戏是否已结束 */
  isGameEnded: boolean;
  /** 手牌选择变化回调 */
  onSelectionChange: (indexes: number[]) => void;
  /** 过牌操作回调 */
  onPass: (player: PlayerType) => void;
  /** 出牌操作回调 */
  onPlayCards: (player: PlayerType) => void;
  /** 编辑手牌操作回调 */
  onEditCards: (player: PlayerType) => void;
}

/**
 * 玩家组件 - 展示玩家身份、手牌和操作按钮
 * 封装了玩家相关的通用UI和交互逻辑
 */
function Player({
  playerType,
  cards,
  selectedIndexes,
  isCurrentPlayer,
  isEditMode,
  isGameEnded,
  onSelectionChange,
  onPass,
  onPlayCards,
  onEditCards,
}: PlayerProps) {
  /** 获取玩家显示名称 */
  const displayName = playerDisplayNames[playerType];

  /** 是否禁用手牌选择 */
  const isHandCardsDisabled = !isCurrentPlayer || isEditMode;

  /** 是否显示操作按钮 */
  const shouldShowActionButtons =
    isCurrentPlayer && !isEditMode && !isGameEnded;

  return (
    <div className="flex flex-col gap-4">
      {/* 玩家身份标识 */}
      <div
        className={`text-center bg-white rounded-lg shadow p-1 font-bold ${
          isCurrentPlayer && !isEditMode ? "ring-2 ring-blue-500" : ""
        }`}
      >
        {displayName}
      </div>

      {/* 手牌展示 */}
      {cards.length > 0 && (
        <HandCards
          cards={cards}
          selectedIndexes={
            isCurrentPlayer && !isEditMode ? selectedIndexes : []
          }
          disabled={isHandCardsDisabled}
          onSelectionChange={onSelectionChange}
        />
      )}

      {/* 操作按钮区域 */}
      {isEditMode ? (
        <Button type="primary" onClick={() => onEditCards(playerType)}>
          编辑手牌
        </Button>
      ) : (
        shouldShowActionButtons && (
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => onPass(playerType)}>
              过牌
            </Button>
            <Button
              className="flex-1"
              type="primary"
              onClick={() => onPlayCards(playerType)}
            >
              出牌
            </Button>
          </div>
        )
      )}
    </div>
  );
}

export default Player;
