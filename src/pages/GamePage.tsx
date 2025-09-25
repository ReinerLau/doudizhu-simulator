import { Button } from "antd";
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
          <Button
            icon={<span className="i-mdi-arrow-left text-base"></span>}
            onClick={handleGoBack}
          >
            返回
          </Button>
          {/* 对局名称 */}
          <h1 className="text-xl font-semibold">{currentGame!.title}</h1>
          <div></div>
        </div>
      </div>

      {/* 对局区域 */}
      <div className="flex-1 p-6">
        <div className="h-full relative">
          {/* 顶家 (左上角) */}
          <div className="absolute left-8 top-8">
            <div className="bg-white rounded-lg shadow-md p-4 min-w-64">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-blue-600">顶家</h3>
                {/* 手牌展示 */}
                <HandCards cards={currentGame?.cards.farmer2 || []} />
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => handlePass("farmer2")}>过牌</Button>
                <Button
                  type="primary"
                  onClick={() => handlePlayCards("farmer2")}
                >
                  出牌
                </Button>
              </div>
            </div>
          </div>

          {/* 下家 (右上角) */}
          <div className="absolute right-8 top-8">
            <div className="bg-white rounded-lg shadow-md p-4 min-w-64">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-green-600">下家</h3>
                {/* 手牌展示 */}
                <HandCards cards={currentGame?.cards.farmer1 || []} />
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => handlePass("farmer1")}>过牌</Button>
                <Button
                  type="primary"
                  onClick={() => handlePlayCards("farmer1")}
                >
                  出牌
                </Button>
              </div>
            </div>
          </div>

          {/* 地主 (底部居中) */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-white rounded-lg shadow-md p-6 min-w-80">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-red-600">地主</h3>
                {/* 手牌展示 */}
                <HandCards cards={currentGame?.cards.landlord || []} />
              </div>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => handlePass("landlord")}>过牌</Button>
                <Button
                  type="primary"
                  onClick={() => handlePlayCards("landlord")}
                >
                  出牌
                </Button>
              </div>
            </div>
          </div>

          {/* 中央出牌区域 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-green-100 rounded-lg border-2 border-green-300 p-8 min-w-96 min-h-48">
              <div className="text-center text-green-700">
                <span className="i-mdi-cards text-6xl mb-4 block"></span>
                <p className="text-lg">出牌区域</p>
                <p className="text-sm opacity-75">等待玩家出牌...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamePage;
