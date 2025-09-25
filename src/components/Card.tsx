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
}

/**
 * 扑克牌组件
 * 显示点数但不考虑花色
 */
const Card: React.FC<CardProps> = ({ value, selected = false, onClick }) => {
  return (
    <div
      className={`
        w-full aspect-square rounded border-1 shadow cursor-pointer flex items-center justify-center font-bold transition-all duration-200
        ${
          selected
            ? "bg-blue-500 text-white border-blue-600"
            : "bg-white border-gray-300 hover:bg-gray-100"
        }
      `}
      onClick={onClick}
    >
      {value}
    </div>
  );
};

export default Card;
