import React from "react";

/**
 * 扑克牌点数类型
 * D: 大王, X: 小王, 2-A: 普通牌点
 */
export type CardValue =
  | "D"
  | "X"
  | "2"
  | "A"
  | "K"
  | "Q"
  | "J"
  | "10"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3";

/**
 * 扑克牌组件属性
 */
interface CardProps {
  /** 扑克牌点数 */
  value: CardValue;
  /** 是否被选中 */
  selected?: boolean;
  /** 点击事件回调 */
  onClick?: () => void;
  /** 额外的 CSS 类名 */
  className?: string;
  /** 内联样式 */
  style?: React.CSSProperties;
}

/**
 * 扑克牌组件
 * 模拟扑克牌的样式，显示点数但不考虑花色
 */
const Card: React.FC<CardProps> = ({
  value,
  selected = false,
  onClick,
  className = "",
  style,
}) => {
  /**
   * 根据点数获取显示文本和样式
   */
  const getCardStyle = (cardValue: CardValue) => {
    switch (cardValue) {
      case "D":
        return {
          text: "JOKER",
          bgColor: "bg-white",
          textColor: "text-red-500",
          borderColor: "border-gray-300",
          isJoker: true,
        };
      case "X":
        return {
          text: "JOKER",
          bgColor: "bg-white",
          textColor: "text-black",
          borderColor: "border-gray-300",
          isJoker: true,
        };
      default:
        return {
          text: cardValue,
          bgColor: "bg-white",
          textColor: "text-black",
          borderColor: "border-gray-300",
          isJoker: false,
        };
    }
  };

  const cardStyle = getCardStyle(value);

  return (
    <div
      className={`
        relative w-16 h-20 rounded-lg border-2 shadow-md cursor-pointer
        transition-all duration-200 hover:shadow-lg hover:-translate-y-2
        ${cardStyle.bgColor}
        ${cardStyle.textColor}
        ${cardStyle.borderColor}
        ${
          selected
            ? "ring-2 ring-blue-400 ring-offset-2 transform -translate-y-2"
            : ""
        }
        ${className}
      `}
      style={style}
      onClick={onClick}
    >
      {/* 左上角点数 */}
      <div
        className={`absolute top-0.5 left-0.5 text-xs font-bold leading-none ${
          cardStyle.isJoker ? "w-3 break-all" : ""
        }`}
      >
        {cardStyle.text}
      </div>
    </div>
  );
};

export default Card;
