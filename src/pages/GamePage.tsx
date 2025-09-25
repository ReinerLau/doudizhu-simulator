import { Button, Divider } from "antd";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { mockGames, type PlayerType } from "../data/mockGames";
import HandCards from "../components/HandCards";

/** 玩家出牌顺序 */
const playerOrder: PlayerType[] = ["landlord", "farmer1", "farmer2"];

/**
 * 对局页面组件 - 正常模式
 * 展示斗地主对局的游戏界面，包含地主、下家、顶家的手牌和操作
 */
function GamePage() {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();

  /**
   * 根据 gameId 获取对局信息
   */
  const currentGame = mockGames.find((game) => game.id === Number(gameId));

  /** 地主选中的牌索引 */
  const [landlordSelectedCards, setLandlordSelectedCards] = useState<number[]>(
    []
  );
  /** 下家选中的牌索引 */
  const [farmer1SelectedCards, setFarmer1SelectedCards] = useState<number[]>(
    []
  );
  /** 顶家选中的牌索引 */
  const [farmer2SelectedCards, setFarmer2SelectedCards] = useState<number[]>(
    []
  );

  /** 当前轮到的玩家 */
  const [currentPlayer, setCurrentPlayer] = useState<PlayerType>("landlord");

  /**
   * 切换到下一个玩家
   */
  const switchToNextPlayer = () => {
    const currentIndex = playerOrder.indexOf(currentPlayer);
    const nextIndex = (currentIndex + 1) % playerOrder.length;
    setCurrentPlayer(playerOrder[nextIndex]);
  };

  /**
   * 根据对局数据设置首发玩家
   */
  useEffect(() => {
    if (currentGame) {
      setCurrentPlayer(currentGame.firstPlayer);
    }
  }, [gameId, currentGame]);

  /**
   * 返回首页
   */
  const handleGoBack = () => {
    navigate("/");
  };

  /**
   * 处理过牌操作
   * @param player - 玩家身份 ('landlord' | 'farmer1' | 'farmer2')
   */
  const handlePass = (player: PlayerType) => {
    // 检查是否轮到该玩家
    if (player !== currentPlayer) {
      console.log(`还没轮到 ${player}，当前轮到 ${currentPlayer}`);
      return;
    }

    console.log(`${player} 过牌`);
    // 过牌后清空选中的牌
    if (player === "landlord") setLandlordSelectedCards([]);
    if (player === "farmer1") setFarmer1SelectedCards([]);
    if (player === "farmer2") setFarmer2SelectedCards([]);

    // 切换到下一个玩家
    switchToNextPlayer();
  };

  /**
   * 处理出牌操作
   * @param player - 玩家身份 ('landlord' | 'farmer1' | 'farmer2')
   */
  const handlePlayCards = (player: PlayerType) => {
    // 检查是否轮到该玩家
    if (player !== currentPlayer) {
      console.log(`还没轮到 ${player}，当前轮到 ${currentPlayer}`);
      return;
    }

    let selectedCards: number[] = [];
    if (player === "landlord") selectedCards = landlordSelectedCards;
    if (player === "farmer1") selectedCards = farmer1SelectedCards;
    if (player === "farmer2") selectedCards = farmer2SelectedCards;

    if (selectedCards.length === 0) {
      console.log(`${player} 没有选中任何牌`);
      return;
    }

    const playerCards =
      currentGame?.cards[player as keyof typeof currentGame.cards] || [];
    const selectedCardValues = selectedCards.map((index) => playerCards[index]);

    console.log(`${player} 出牌:`, selectedCardValues);

    // 出牌后清空选中的牌
    if (player === "landlord") setLandlordSelectedCards([]);
    if (player === "farmer1") setFarmer1SelectedCards([]);
    if (player === "farmer2") setFarmer2SelectedCards([]);

    // 切换到下一个玩家
    switchToNextPlayer();
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* 顶部操作栏 */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <Button onClick={handleGoBack}>返回</Button>
          <div className="flex flex-col items-center">
            {/* 对局名称 */}
            <h1 className="text-xl font-semibold">{currentGame!.title}</h1>
          </div>
        </div>
      </div>

      {/* 对局区域 */}
      <div className="flex-1 p-6 flex flex-col !lg:flex-row">
        <div className="flex flex-col justify-between gap-4 lg:w-screen-xl">
          {/* 地主 */}
          <div className="flex flex-col gap-4">
            <div
              className={`text-center bg-white rounded-lg shadow p-1 font-bold ${
                currentPlayer === "landlord" ? "ring-2 ring-blue-500" : ""
              }`}
            >
              地主
            </div>
            {/* 手牌展示 */}
            <HandCards
              cards={currentGame?.cards.landlord || []}
              selectedIndexes={landlordSelectedCards}
              disabled={currentPlayer !== "landlord"}
              onSelectionChange={setLandlordSelectedCards}
            />
            {currentPlayer === "landlord" && (
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
            <HandCards
              cards={currentGame?.cards.farmer1 || []}
              selectedIndexes={farmer1SelectedCards}
              disabled={currentPlayer !== "farmer1"}
              onSelectionChange={setFarmer1SelectedCards}
            />
            {currentPlayer === "farmer1" && (
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
            <HandCards
              cards={currentGame?.cards.farmer2 || []}
              selectedIndexes={farmer2SelectedCards}
              disabled={currentPlayer !== "farmer2"}
              onSelectionChange={setFarmer2SelectedCards}
            />
            {currentPlayer === "farmer2" && (
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
            )}
          </div>
        </div>
        <Divider type="vertical" className="hidden !lg:block h-full" />
        {/* 牌堆 */}
        <div className="flex-1"></div>
      </div>
    </div>
  );
}

export default GamePage;
