import React from "react";
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
 * 以叠放方式展示玩家手牌，牌与牌之间重叠，只露出点数部分
 */
const HandCards: React.FC<HandCardsProps> = ({ cards }) => {
  return (
    <div className={`flex justify-center ml-11`}>
      {cards.map((cardValue, index) => (
        <Card key={index} value={cardValue} className="-ml-11" />
      ))}
    </div>
  );
};

export default HandCards;
