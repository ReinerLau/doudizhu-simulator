import { Button, Modal, Input, message } from "antd";
import { useNavigate, useParams, useLocation } from "react-router";
import { useState, useEffect } from "react";
import Player from "../components/Player";
import PlayedCards from "../components/PlayedCards";
import GameDatabaseService from "../services/gameDatabase";
import type { PlayerType, PlayerCards, Game, CardValue } from "../types";

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
  const [messageApi, contextHolder] = message.useMessage();

  /** 判断是否为编辑模式 */
  const isEditMode =
    location.pathname.startsWith("/edit-game/") || gameId === "new";
  /** 判断是否为新增模式 */
  const isNewMode = gameId === "new";

  /**
   * 当前对局信息（从数据库加载）
   */
  const [currentGame, setCurrentGame] = useState<Game | null>(null);

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
  const [titleInputValue, setTitleInputValue] = useState<string>("");
  const [editTitleModalVisible, setEditTitleModalVisible] =
    useState<boolean>(false);
  const [editCardsModalVisible, setEditCardsModalVisible] =
    useState<boolean>(false);
  const [editingPlayer, setEditingPlayer] = useState<PlayerType | null>(null);
  const [cardsInputValue, setCardsInputValue] = useState<string>("");

  /** 保存状态 */
  const [isSaving, setIsSaving] = useState<boolean>(false);

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
   * 从数据库加载对局数据
   */
  useEffect(() => {
    const loadGame = async () => {
      if (isNewMode) {
        // 新增模式：设置默认值
        setCurrentGame(null);
        return;
      }

      try {
        const game = await GameDatabaseService.getGameById(Number(gameId));
        setCurrentGame(game || null);
      } catch (error) {
        console.error("加载对局失败:", error);
        messageApi.error("加载对局失败");
        navigate("/");
      }
    };

    loadGame();
  }, [gameId, isNewMode, navigate, messageApi]);

  /**
   * 根据对局数据设置首发玩家和初始手牌
   */
  useEffect(() => {
    if (isNewMode) {
      // 新增模式：设置默认值
      const defaultTitle = "新对局";
      setGameTitle(defaultTitle);
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
  }, [currentGame, isNewMode]);

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

    // 通过字符切割，特殊处理10
    const cards: CardValue[] = [];
    let i = 0;

    while (i < trimmedInput.length) {
      let cardStr = "";

      // 检查是否为10（两个字符）
      if (
        i < trimmedInput.length - 1 &&
        trimmedInput.slice(i, i + 2) === "10"
      ) {
        cardStr = "10";
        i += 2;
      } else {
        // 单个字符的牌
        cardStr = trimmedInput[i];
        i += 1;
      }

      // 转换为大写进行匹配，支持大小写兼容
      const upperCardStr = cardStr.toUpperCase();
      if (!validCardValues.includes(upperCardStr as CardValue)) {
        return {
          isValid: false,
          cards: [],
          error: `无效的手牌类型: ${cardStr}。有效类型: ${validCardValues.join(
            ", "
          )}`,
        };
      }
      cards.push(upperCardStr as CardValue);
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
    // 将当前标题设置为输入框的初始值
    setTitleInputValue(gameTitle);
    setEditTitleModalVisible(true);
  };

  /**
   * 确认修改对局名称
   */
  const handleConfirmEditTitle = () => {
    if (titleInputValue.trim()) {
      // 只有确认时才同步到 gameTitle
      setGameTitle(titleInputValue.trim());
      setEditTitleModalVisible(false);
      setTitleInputValue("");
      messageApi.success("对局名称已更新");
    } else {
      messageApi.error("对局名称不能为空");
    }
  };

  /**
   * 处理手牌编辑
   * @param player - 要编辑的玩家
   */
  const handleEditCards = (player: PlayerType) => {
    setEditingPlayer(player);
    // 设置当前手牌作为初始值，直接连接字符不用空格分隔
    const currentPlayerCards = currentCards[player];
    setCardsInputValue(currentPlayerCards.join(""));
    setEditCardsModalVisible(true);
  };

  /**
   * 确认修改手牌
   */
  const handleConfirmEditCards = () => {
    if (!editingPlayer) return;

    const validation = validateCardsInput(cardsInputValue);
    if (!validation.isValid) {
      messageApi.error(validation.error);
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
    messageApi.success("手牌已更新");
  };

  /**
   * 取消编辑
   */
  const handleCancelEdit = () => {
    setEditTitleModalVisible(false);
    setEditCardsModalVisible(false);
    setEditingPlayer(null);
    setCardsInputValue("");
    setTitleInputValue("");
  };

  /**
   * 保存对局到数据库
   */
  const handleSaveGame = async () => {
    if (!gameTitle.trim()) {
      messageApi.error("对局名称不能为空");
      return;
    }

    // 检查是否所有玩家都有手牌
    if (
      currentCards.landlord.length === 0 &&
      currentCards.farmer1.length === 0 &&
      currentCards.farmer2.length === 0
    ) {
      messageApi.error("请至少为一个玩家设置手牌");
      return;
    }

    setIsSaving(true);

    try {
      const gameData: Omit<Game, "id"> | Game = {
        ...(currentGame?.id ? { id: currentGame.id } : {}),
        title: gameTitle.trim(),
        firstPlayer: currentPlayer,
        cards: {
          landlord: [...currentCards.landlord],
          farmer1: [...currentCards.farmer1],
          farmer2: [...currentCards.farmer2],
        },
      };

      await GameDatabaseService.saveGame(gameData);

      if (isNewMode) {
        messageApi.success("对局创建成功");
      } else {
        messageApi.success("对局保存成功");
      }

      // 保存成功后跳转到首页
      navigate("/");
    } catch (error) {
      console.error("保存对局失败:", error);
      messageApi.error("保存对局失败");
    } finally {
      setIsSaving(false);
    }
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
      {contextHolder}
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
          {isEditMode && (
            <Button type="primary" loading={isSaving} onClick={handleSaveGame}>
              {isSaving ? "保存中..." : "保存"}
            </Button>
          )}
        </div>
      </div>

      {/* 对局区域 */}
      <div className="flex-1 p-6 flex flex-col !lg:flex-row gap-4">
        <div className="flex flex-col justify-between gap-4 lg:w-screen-xl">
          {/* 地主 */}
          <Player
            playerType="landlord"
            cards={currentCards.landlord}
            selectedIndexes={selectedCards}
            isCurrentPlayer={currentPlayer === "landlord"}
            isEditMode={isEditMode}
            isGameEnded={isGameEnded}
            onSelectionChange={setSelectedCards}
            onPass={handlePass}
            onPlayCards={handlePlayCards}
            onEditCards={handleEditCards}
          />
          {/* 下家 */}
          <Player
            playerType="farmer1"
            cards={currentCards.farmer1}
            selectedIndexes={selectedCards}
            isCurrentPlayer={currentPlayer === "farmer1"}
            isEditMode={isEditMode}
            isGameEnded={isGameEnded}
            onSelectionChange={setSelectedCards}
            onPass={handlePass}
            onPlayCards={handlePlayCards}
            onEditCards={handleEditCards}
          />
          {/* 顶家 */}
          <Player
            playerType="farmer2"
            cards={currentCards.farmer2}
            selectedIndexes={selectedCards}
            isCurrentPlayer={currentPlayer === "farmer2"}
            isEditMode={isEditMode}
            isGameEnded={isGameEnded}
            onSelectionChange={setSelectedCards}
            onPass={handlePass}
            onPlayCards={handlePlayCards}
            onEditCards={handleEditCards}
          />
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
          value={titleInputValue}
          onChange={(e) => setTitleInputValue(e.target.value)}
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
          placeholder="例如: DX22AAKQJ1098765432"
          value={cardsInputValue}
          onChange={(e) => setCardsInputValue(e.target.value)}
          maxLength={200}
        />
      </Modal>
    </div>
  );
}

export default GamePage;
