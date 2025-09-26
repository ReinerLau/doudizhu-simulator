import { Button, Modal, Input, message } from "antd";
import { useNavigate, useParams, useLocation } from "react-router";
import { useState, useEffect } from "react";
import {
  mockGames,
  type PlayerType,
  type PlayerCards,
} from "../data/mockGames";
import HandCards from "../components/HandCards";
import PlayedCards from "../components/PlayedCards";
import { type CardValue } from "../components/Card";

/** 玩家出牌顺序 */
const playerOrder: PlayerType[] = ["landlord", "farmer1", "farmer2"];

/** 有效的手牌类型 */
const validCardValues: CardValue[] = [
  "D",
  "X",
  "2",
  "A",
  "K",
  "Q",
  "J",
  "10",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
];

/**
 * 对局页面组件 - 支持正常模式和编辑模式
 * 展示斗地主对局的游戏界面，包含地主、下家、顶家的手牌和操作
 */
function GamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { gameId } = useParams<{ gameId: string }>();

  /** 判断是否为编辑模式 */
  const isEditMode = location.pathname.includes("/edit") || gameId === "new";
  /** 判断是否为新增模式 */
  const isNewMode = gameId === "new";

  /**
   * 根据 gameId 获取对局信息
   */
  const currentGame = isNewMode
    ? null
    : mockGames.find((game) => game.id === Number(gameId));

  /** 当前玩家选中的牌索引 */
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  /** 当前轮到的玩家 */
  const [currentPlayer, setCurrentPlayer] = useState<PlayerType>("landlord");

  /** 牌堆中的牌（最近一次出牌） */
  const [playedCards, setPlayedCards] = useState<CardValue[]>([]);

  /** 当前对局的手牌状态（可变） */
  const [currentCards, setCurrentCards] = useState<PlayerCards>({
    landlord: [],
    farmer1: [],
    farmer2: [],
  });

  /** 游戏是否已结束 */
  const [isGameEnded, setIsGameEnded] = useState<boolean>(false);

  /** 编辑模式相关状态 */
  const [gameTitle, setGameTitle] = useState<string>("");
  const [editTitleModalVisible, setEditTitleModalVisible] =
    useState<boolean>(false);
  const [editCardsModalVisible, setEditCardsModalVisible] =
    useState<boolean>(false);
  const [editingPlayer, setEditingPlayer] = useState<PlayerType | null>(null);
  const [cardsInputValue, setCardsInputValue] = useState<string>("");

  /**
   * 检查游戏是否结束
   * @param cards - 当前手牌状态
   * @returns 获胜玩家，如果游戏未结束则返回null
   */
  const checkGameEnd = (cards: PlayerCards): PlayerType | null => {
    // 检查每个玩家的手牌数量
    if (cards.landlord.length === 0) return "landlord";
    if (cards.farmer1.length === 0) return "farmer1";
    if (cards.farmer2.length === 0) return "farmer2";
    return null;
  };

  /**
   * 切换到下一个玩家
   * 如果游戏已结束（任意玩家手牌数量为0），则不进行切换
   */
  const switchToNextPlayer = () => {
    // 检查游戏是否已结束，如果已结束则不切换玩家
    if (isGameEnded) {
      return;
    }

    const currentIndex = playerOrder.indexOf(currentPlayer);
    const nextIndex = (currentIndex + 1) % playerOrder.length;
    setCurrentPlayer(playerOrder[nextIndex]);
    // 切换玩家时清空选中的牌
    setSelectedCards([]);
  };

  /**
   * 根据对局数据设置首发玩家和初始手牌
   */
  useEffect(() => {
    if (isNewMode) {
      // 新增模式：设置默认值
      setGameTitle("新对局");
      setCurrentPlayer("landlord");
      setCurrentCards({
        landlord: [],
        farmer1: [],
        farmer2: [],
      });
    } else if (currentGame) {
      // 编辑或正常模式：使用现有数据
      setGameTitle(currentGame.title);
      setCurrentPlayer(currentGame.firstPlayer);
      setCurrentCards({
        landlord: [...currentGame.cards.landlord],
        farmer1: [...currentGame.cards.farmer1],
        farmer2: [...currentGame.cards.farmer2],
      });
    }
  }, [gameId, currentGame, isNewMode]);

  /**
   * 监听手牌变化，检查游戏是否结束
   */
  useEffect(() => {
    // 只在手牌状态有效时检查游戏结束
    if (
      currentCards.landlord.length > 0 ||
      currentCards.farmer1.length > 0 ||
      currentCards.farmer2.length > 0
    ) {
      const gameWinner = checkGameEnd(currentCards);
      if (gameWinner && !isGameEnded) {
        setIsGameEnded(true);
        console.log(`游戏结束！获胜者: ${gameWinner}`);
      }
    }
  }, [currentCards, isGameEnded]);

  /**
   * 返回首页
   */
  const handleGoBack = () => {
    navigate("/");
  };

  /**
   * 重来功能 - 重置对局到初始状态
   */
  const handleRestart = () => {
    if (currentGame) {
      // 重置手牌状态为初始状态
      setCurrentCards({
        landlord: [...currentGame.cards.landlord],
        farmer1: [...currentGame.cards.farmer1],
        farmer2: [...currentGame.cards.farmer2],
      });
      // 重置当前玩家为首发玩家
      setCurrentPlayer(currentGame.firstPlayer);
      // 清空选中的牌
      setSelectedCards([]);
      // 清空牌堆
      setPlayedCards([]);
      // 重置游戏结束状态
      setIsGameEnded(false);
      console.log("对局已重置到初始状态");
    }
  };

  /**
   * 验证手牌输入是否有效
   * @param input - 输入的手牌字符串
   * @returns 验证结果和错误信息
   */
  const validateCardsInput = (
    input: string
  ): { isValid: boolean; cards: CardValue[]; error?: string } => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      return { isValid: true, cards: [] };
    }

    // 按空格或逗号分割
    const cardStrings = trimmedInput
      .split(/[,\s]+/)
      .filter((card) => card.length > 0);
    const cards: CardValue[] = [];

    for (const cardStr of cardStrings) {
      if (!validCardValues.includes(cardStr as CardValue)) {
        return {
          isValid: false,
          cards: [],
          error: `无效的手牌类型: ${cardStr}。有效类型: ${validCardValues.join(
            ", "
          )}`,
        };
      }
      cards.push(cardStr as CardValue);
    }

    // 检查手牌数量限制
    const maxCards = editingPlayer === "landlord" ? 20 : 17;
    if (cards.length > maxCards) {
      return {
        isValid: false,
        cards: [],
        error: `${
          editingPlayer === "landlord" ? "地主" : "农民"
        }手牌数量不能超过${maxCards}张`,
      };
    }

    return { isValid: true, cards };
  };

  /**
   * 处理对局名称编辑
   */
  const handleEditTitle = () => {
    setEditTitleModalVisible(true);
  };

  /**
   * 确认修改对局名称
   */
  const handleConfirmEditTitle = () => {
    if (gameTitle.trim()) {
      setEditTitleModalVisible(false);
      message.success("对局名称已更新");
    } else {
      message.error("对局名称不能为空");
    }
  };

  /**
   * 处理手牌编辑
   * @param player - 要编辑的玩家
   */
  const handleEditCards = (player: PlayerType) => {
    setEditingPlayer(player);
    // 设置当前手牌作为初始值
    const currentPlayerCards = currentCards[player];
    setCardsInputValue(currentPlayerCards.join(" "));
    setEditCardsModalVisible(true);
  };

  /**
   * 确认修改手牌
   */
  const handleConfirmEditCards = () => {
    if (!editingPlayer) return;

    const validation = validateCardsInput(cardsInputValue);
    if (!validation.isValid) {
      message.error(validation.error);
      return;
    }

    // 更新手牌
    setCurrentCards((prev) => ({
      ...prev,
      [editingPlayer]: validation.cards,
    }));

    setEditCardsModalVisible(false);
    setEditingPlayer(null);
    setCardsInputValue("");
    message.success("手牌已更新");
  };

  /**
   * 取消编辑
   */
  const handleCancelEdit = () => {
    setEditTitleModalVisible(false);
    setEditCardsModalVisible(false);
    setEditingPlayer(null);
    setCardsInputValue("");
  };

  /**
   * 处理过牌操作
   * @param player - 玩家身份 ('landlord' | 'farmer1' | 'farmer2')
   */
  const handlePass = (player: PlayerType) => {
    // 检查游戏是否已结束
    if (isGameEnded) {
      console.log(`游戏已结束，无法进行过牌操作`);
      return;
    }

    // 检查是否轮到该玩家
    if (player !== currentPlayer) {
      console.log(`还没轮到 ${player}，当前轮到 ${currentPlayer}`);
      return;
    }

    console.log(`${player} 过牌`);
    // 切换到下一个玩家（会自动清空选中的牌）
    switchToNextPlayer();
  };

  /**
   * 处理出牌操作
   * @param player - 玩家身份 ('landlord' | 'farmer1' | 'farmer2')
   */
  const handlePlayCards = (player: PlayerType) => {
    // 检查游戏是否已结束
    if (isGameEnded) {
      console.log(`游戏已结束，无法进行出牌操作`);
      return;
    }

    // 检查是否轮到该玩家
    if (player !== currentPlayer) {
      console.log(`还没轮到 ${player}，当前轮到 ${currentPlayer}`);
      return;
    }

    if (selectedCards.length === 0) {
      console.log(`${player} 没有选中任何牌`);
      return;
    }

    const playerCards = currentCards[player];
    const selectedCardValues = selectedCards.map((index) => playerCards[index]);

    console.log(`${player} 出牌:`, selectedCardValues);

    // 将选中的牌显示在牌堆中（覆盖之前的牌）
    setPlayedCards(selectedCardValues);

    // 从玩家手牌中移除已出的牌
    const newPlayerCards = playerCards.filter(
      (_, index) => !selectedCards.includes(index)
    );

    // 更新手牌状态
    const newCards = {
      ...currentCards,
      [player]: newPlayerCards,
    };
    setCurrentCards(newCards);

    // 检查游戏是否结束
    const gameWinner = checkGameEnd(newCards);
    if (gameWinner) {
      setIsGameEnded(true);
      console.log(`游戏结束！获胜者: ${gameWinner}`);
      // 清空选中的牌，但不切换到下一个玩家
      setSelectedCards([]);
    } else {
      // 切换到下一个玩家（会自动清空选中的牌）
      switchToNextPlayer();
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* 顶部操作栏 */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <Button onClick={handleGoBack}>返回</Button>
          <div className="flex flex-col items-center">
            {/* 对局名称 */}
            {isEditMode ? (
              <h1
                className="text-xl font-semibold cursor-pointer hover:text-blue-500 transition-colors"
                onClick={handleEditTitle}
                title="点击编辑对局名称"
              >
                {gameTitle}
              </h1>
            ) : (
              <h1 className="text-xl font-semibold">{gameTitle}</h1>
            )}
          </div>
          {!isEditMode && <Button onClick={handleRestart}>重来</Button>}
          {isEditMode && <Button type="primary">保存</Button>}
        </div>
      </div>

      {/* 对局区域 */}
      <div className="flex-1 p-6 flex flex-col !lg:flex-row gap-4">
        <div className="flex flex-col justify-between gap-4 lg:w-screen-xl">
          {/* 地主 */}
          <div className="flex flex-col gap-4">
            <div
              className={`text-center bg-white rounded-lg shadow p-1 font-bold ${
                currentPlayer === "landlord" && !isEditMode
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
            >
              地主
            </div>
            {/* 手牌展示 */}
            {currentCards.landlord.length > 0 && (
              <HandCards
                cards={currentCards.landlord}
                selectedIndexes={
                  currentPlayer === "landlord" && !isEditMode
                    ? selectedCards
                    : []
                }
                disabled={currentPlayer !== "landlord" || isEditMode}
                onSelectionChange={setSelectedCards}
              />
            )}
            {isEditMode ? (
              <Button
                type="primary"
                onClick={() => handleEditCards("landlord")}
              >
                编辑手牌
              </Button>
            ) : (
              currentPlayer === "landlord" &&
              !isGameEnded && (
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handlePass("landlord")}
                  >
                    过牌
                  </Button>
                  <Button
                    className="flex-1"
                    type="primary"
                    onClick={() => handlePlayCards("landlord")}
                  >
                    出牌
                  </Button>
                </div>
              )
            )}
          </div>
          {/* 下家 */}
          <div className="flex flex-col gap-4">
            <div
              className={`text-center bg-white rounded-lg shadow p-1 font-bold ${
                currentPlayer === "farmer1" ? "ring-2 ring-blue-500" : ""
              }`}
            >
              下家
            </div>
            {/* 手牌展示 */}
            {currentCards.farmer1.length > 0 && (
              <HandCards
                cards={currentCards.farmer1}
                selectedIndexes={
                  currentPlayer === "farmer1" && !isEditMode
                    ? selectedCards
                    : []
                }
                disabled={currentPlayer !== "farmer1" || isEditMode}
                onSelectionChange={setSelectedCards}
              />
            )}
            {isEditMode ? (
              <Button type="primary" onClick={() => handleEditCards("farmer1")}>
                编辑手牌
              </Button>
            ) : (
              currentPlayer === "farmer1" &&
              !isGameEnded && (
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handlePass("farmer1")}
                  >
                    过牌
                  </Button>
                  <Button
                    className="flex-1"
                    type="primary"
                    onClick={() => handlePlayCards("farmer1")}
                  >
                    出牌
                  </Button>
                </div>
              )
            )}
          </div>
          {/* 顶家 */}
          <div className="flex flex-col gap-4">
            <div
              className={`text-center bg-white rounded-lg shadow p-1 font-bold ${
                currentPlayer === "farmer2" ? "ring-2 ring-blue-500" : ""
              }`}
            >
              顶家
            </div>
            {/* 手牌展示 */}
            {currentCards.farmer2.length > 0 && (
              <HandCards
                cards={currentCards.farmer2}
                selectedIndexes={
                  currentPlayer === "farmer2" && !isEditMode
                    ? selectedCards
                    : []
                }
                disabled={currentPlayer !== "farmer2" || isEditMode}
                onSelectionChange={setSelectedCards}
              />
            )}
            {isEditMode ? (
              <Button type="primary" onClick={() => handleEditCards("farmer2")}>
                编辑手牌
              </Button>
            ) : (
              currentPlayer === "farmer2" &&
              !isGameEnded && (
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handlePass("farmer2")}
                  >
                    过牌
                  </Button>
                  <Button
                    className="flex-1"
                    type="primary"
                    onClick={() => handlePlayCards("farmer2")}
                  >
                    出牌
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
        {/* 牌堆 */}
        <div className="flex-1">
          <PlayedCards playedCards={playedCards} />
        </div>
      </div>

      {/* 编辑对局名称弹窗 */}
      <Modal
        open={editTitleModalVisible}
        onOk={handleConfirmEditTitle}
        onCancel={handleCancelEdit}
        okText="确认"
        cancelText="取消"
        closable={false}
      >
        <Input
          placeholder="请输入对局名称"
          value={gameTitle}
          onChange={(e) => setGameTitle(e.target.value)}
          onPressEnter={handleConfirmEditTitle}
        />
      </Modal>

      {/* 编辑手牌弹窗 */}
      <Modal
        open={editCardsModalVisible}
        onOk={handleConfirmEditCards}
        onCancel={handleCancelEdit}
        okText="确认"
        cancelText="取消"
        closable={false}
      >
        <Input
          placeholder="例如: D X 2 2 A A K Q J 10 9 8 7 6 5 4 3"
          value={cardsInputValue}
          onChange={(e) => setCardsInputValue(e.target.value)}
          maxLength={200}
        />
      </Modal>
    </div>
  );
}

export default GamePage;
