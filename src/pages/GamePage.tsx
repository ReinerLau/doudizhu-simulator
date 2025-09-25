import { Button, Divider } from "antd";
import { useNavigate, useParams } from "react-router";
import { mockGames } from "../data/mockGames";
import HandCards from "../components/HandCards";

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
  const handlePass = (player: string) => {
    console.log(`${player} 过牌`);
  };

  /**
   * 处理出牌操作
   * @param player - 玩家身份 ('landlord' | 'farmer1' | 'farmer2')
   */
  const handlePlayCards = (player: string) => {
    console.log(`${player} 出牌`);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* 顶部操作栏 */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <Button onClick={handleGoBack}>返回</Button>
          {/* 对局名称 */}
          <h1 className="text-xl font-semibold">{currentGame!.title}</h1>
        </div>
      </div>

      {/* 对局区域 */}
      <div className="flex-1 p-6 flex flex-col !lg:flex-row">
        <div className="flex flex-col justify-between gap-4 lg:w-screen-xl">
          {/* 地主 */}
          <div className="flex flex-col gap-4">
            <div className=" text-center bg-white rounded-lg shadow p-1 font-bold">
              地主
            </div>
            {/* 手牌展示 */}
            <HandCards cards={currentGame?.cards.landlord || []} />
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => handlePass("landlord")}>
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
          </div>
          {/* 下家 */}
          <div className=" flex flex-col gap-4">
            <div className="text-center bg-white rounded-lg shadow p-1 font-bold">
              下家
            </div>
            {/* 手牌展示 */}
            <HandCards cards={currentGame?.cards.farmer1 || []} />
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => handlePass("farmer1")}>
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
          </div>
          {/* 顶家 */}
          <div className=" flex flex-col gap-4">
            <div className="text-center bg-white rounded-lg shadow p-1 font-bold">
              顶家
            </div>
            {/* 手牌展示 */}
            <HandCards cards={currentGame?.cards.farmer2 || []} />
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => handlePass("farmer2")}>
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
