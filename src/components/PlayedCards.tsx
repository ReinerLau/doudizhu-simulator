import React from "react";
import { Row, Col } from "antd";
import Card from "./Card";
import type { PlayedCardsProps } from "../types";

/**
 * 牌堆组件
 * 显示最近一次出牌的内容
 */
const PlayedCards: React.FC<PlayedCardsProps> = ({ playedCards }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full flex items-center">
      <Row className="w-full" gutter={[8, 8]} justify="center">
        {playedCards.map((cardValue, index) => (
          <Col key={index} span={2}>
            <Card value={cardValue} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PlayedCards;
