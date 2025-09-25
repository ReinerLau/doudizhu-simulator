import React from "react";
import { Row, Col } from "antd";
import Card, { type CardValue } from "./Card";

/**
 * 手牌展示组件属性
 */
interface HandCardsProps {
  /** 手牌数组 */
  cards: CardValue[];
}

/**
 * 手牌展示组件
 * 使用网格布局展示玩家手牌
 */
const HandCards: React.FC<HandCardsProps> = ({ cards }) => {
  return (
    <Row gutter={[8, 8]}>
      {cards.map((cardValue, index) => (
        <Col key={index} span={2} md={1}>
          <Card value={cardValue} />
        </Col>
      ))}
    </Row>
  );
};

export default HandCards;
