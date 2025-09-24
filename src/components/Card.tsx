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
}) => {
  /**
   * 根据点数获取显示文本和样式
   */
  const getCardStyle = (cardValue: CardValue) => {
    switch (cardValue) {
      case "D":
        return {
          text: "大王",
          bgColor: "bg-gradient-to-br from-red-500 to-red-600",
          textColor: "text-white",
          borderColor: "border-red-400",
        };
      case "X":
        return {
          text: "小王",
          bgColor: "bg-gradient-to-br from-gray-700 to-gray-800",
          textColor: "text-white",
          borderColor: "border-gray-600",
        };
      case "2":
      case "A":
        return {
          text: cardValue,
          bgColor: "bg-gradient-to-br from-orange-400 to-orange-500",
          textColor: "text-white",
          borderColor: "border-orange-300",
        };
      default:
        return {
          text: cardValue,
          bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
          textColor: "text-gray-800",
          borderColor: "border-blue-200",
        };
    }
  };

  const cardStyle = getCardStyle(value);

  return (
    <div
      className={`
        relative w-12 h-16 rounded-lg border-2 shadow-md cursor-pointer
        transition-all duration-200 hover:shadow-lg hover:scale-105
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
      onClick={onClick}
    >
      {/* 左上角点数 */}
      <div className="absolute top-0.5 left-0.5 text-xs font-bold leading-none">
        {cardStyle.text}
      </div>

      {/* 中央点数 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-bold ${
            cardStyle.text.length > 1 ? "text-xs" : "text-lg"
          }`}
        >
          {cardStyle.text}
        </span>
      </div>

      {/* 右下角点数（旋转180度） */}
      <div className="absolute bottom-0.5 right-0.5 text-xs font-bold leading-none transform rotate-180">
        {cardStyle.text}
      </div>
    </div>
  );
};

export default Card;
