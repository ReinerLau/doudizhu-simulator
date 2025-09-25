import React from "react";
import { Row, Col } from "antd";
import Card, { type CardValue } from "./Card";
import { type PlayerType } from "../data/mockGames";

/**
 * 已出牌信息
 */
interface PlayedCardsInfo {
  /** 出牌玩家 */
  player: PlayerType;
  /** 出的牌 */
  cards: CardValue[];
}

/**
 * 牌堆组件属性
 */
interface PlayedCardsProps {
  /** 当前牌堆中的牌（最近一次出牌） */
  playedCards?: PlayedCardsInfo;
}

/**
 * 牌堆组件
 * 显示最近一次出牌的内容
 */
const PlayedCards: React.FC<PlayedCardsProps> = ({ playedCards }) => {
  /**
   * 获取玩家显示名称
   * @param player - 玩家类型
   * @returns 玩家显示名称
   */
  const getPlayerDisplayName = (player: PlayerType): string => {
    switch (player) {
      case "landlord":
        return "地主";
      case "farmer1":
        return "下家";
      case "farmer2":
        return "顶家";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <h3 className="text-lg font-semibold mb-4 text-center">牌堆</h3>

      {playedCards ? (
        <div className="space-y-4">
          {/* 出牌玩家标识 */}
          <div className="text-center">
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {getPlayerDisplayName(playedCards.player)} 出牌
            </span>
          </div>

          {/* 出的牌 */}
          <div className="flex justify-center">
            <Row gutter={[4, 4]} justify="center">
              {playedCards.cards.map((cardValue, index) => (
                <Col key={index} span={6} md={4} lg={3}>
                  <Card value={cardValue} />
                </Col>
              ))}
            </Row>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-32 text-gray-400">
          暂无出牌
        </div>
      )}
    </div>
  );
};

export default PlayedCards;
