import React, { useState } from "react";
import { Row, Col } from "antd";
import Card, { type CardValue } from "./Card";

/**
 * 手牌展示组件属性
 */
interface HandCardsProps {
  /** 手牌数组 */
  cards: CardValue[];
  /** 选中的牌的索引回调 */
  onSelectionChange?: (selectedIndexes: number[]) => void;
}

/**
 * 手牌展示组件
 * 使用网格布局展示玩家手牌，支持多选
 */
const HandCards: React.FC<HandCardsProps> = ({ cards, onSelectionChange }) => {
  /** 选中的牌的索引数组 */
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  /**
   * 处理牌的点击事件
   * @param index - 被点击牌的索引
   */
  const handleCardClick = (index: number) => {
    const newSelectedIndexes = selectedIndexes.includes(index)
      ? selectedIndexes.filter((i) => i !== index) // 如果已选中则取消选中
      : [...selectedIndexes, index]; // 如果未选中则添加到选中列表

    setSelectedIndexes(newSelectedIndexes);
    onSelectionChange?.(newSelectedIndexes);
  };

  return (
    <Row gutter={[8, 8]}>
      {cards.map((cardValue, index) => (
        <Col key={index} span={2} md={1}>
          <Card
            value={cardValue}
            selected={selectedIndexes.includes(index)}
            onClick={() => handleCardClick(index)}
          />
        </Col>
      ))}
    </Row>
  );
};

export default HandCards;
