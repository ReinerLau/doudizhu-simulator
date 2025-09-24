import { Button, Input, Card, Upload, Dropdown, Space } from "antd";
import type { MenuProps } from "antd";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { mockGames } from "../data/mockGames";

/**
 * 首页组件
 * 展示对局列表、搜索、上传下载等功能
 */
function HomePage() {
  const navigate = useNavigate();

  // 搜索关键词状态
  const [searchKeyword, setSearchKeyword] = useState("");

  // 筛选后的对局列表
  const filteredGames = useMemo(() => {
    if (!searchKeyword.trim()) {
      return mockGames;
    }
    return mockGames.filter((game) =>
      game.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [searchKeyword]);

  /**
   * 处理卡片点击事件，跳转到对局页面(正常模式)
   * @param gameId - 对局ID
   */
  const handleCardClick = (gameId: number) => {
    navigate(`/game/${gameId}`);
  };

  /**
   * 处理右键菜单点击事件
   * @param key - 菜单项key
   * @param gameId - 对局ID
   */
  const handleMenuClick = (key: string, gameId: number) => {
    switch (key) {
      case "edit":
        navigate(`/game/${gameId}/edit`);
        break;
      case "delete":
        console.log("删除对局:", gameId);
        break;
      case "download":
        console.log("下载对局:", gameId);
        break;
    }
  };

  // 右键菜单配置
  const getContextMenu = (gameId: number): MenuProps => ({
    items: [
      {
        key: "edit",
        label: (
          <div className="flex items-center gap-2">
            <span className="i-mdi-pencil text-base"></span>
            编辑
          </div>
        ),
      },
      {
        key: "delete",
        label: (
          <div className="flex items-center gap-2 text-red-500">
            <span className="i-mdi-delete text-base"></span>
            删除
          </div>
        ),
      },
      {
        key: "download",
        label: (
          <div className="flex items-center gap-2">
            <span className="i-mdi-download text-base"></span>
            下载
          </div>
        ),
      },
    ],
    onClick: ({ key }) => handleMenuClick(key, gameId),
  });

  /**
   * 处理添加对局按钮点击
   */
  const handleAddGame = () => {
    navigate("/game/new");
  };

  return (
    <div className="h-screen bg-gray-50 p-6">
      {/* 操作栏 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* 搜索框 */}
          <div className="flex-1">
            <Input
              placeholder="搜索对局标题..."
              size="large"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          {/* 操作按钮 */}
          <Space size="middle" className="flex-shrink-0">
            <Upload
              accept=".json"
              showUploadList={false}
              beforeUpload={() => false}
            >
              <Button
                size="large"
                icon={<span className="i-mdi-upload text-base"></span>}
              >
                上传对局
              </Button>
            </Upload>

            <Button
              size="large"
              icon={<span className="i-mdi-download text-base"></span>}
            >
              下载对局
            </Button>

            <Button
              type="primary"
              size="large"
              icon={<span className="i-mdi-plus text-base"></span>}
              onClick={handleAddGame}
            >
              添加对局
            </Button>
          </Space>
        </div>
      </div>

      {/* 对局卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredGames.map((game) => (
          <Dropdown
            key={game.id}
            menu={getContextMenu(game.id)}
            trigger={["contextMenu"]}
          >
            <Card
              hoverable
              className="cursor-pointer transition-all duration-200 hover:shadow-md"
              onClick={() => handleCardClick(game.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 flex items-center justify-center">
                  <h3 className="text-lg">{game.title}</h3>
                </div>
              </div>
            </Card>
          </Dropdown>
        ))}
      </div>

      {/* 空状态提示 */}
      {filteredGames.length === 0 && (
        <div className="text-center py-16">
          {searchKeyword ? (
            <>
              <h3 className="text-xl text-gray-500 mb-2">未找到相关对局</h3>
              <p className="text-gray-400 mb-6">尝试使用其他关键词搜索</p>
            </>
          ) : (
            <>
              <h3 className="text-xl text-gray-500 mb-2">暂无对局</h3>
              <p className="text-gray-400 mb-6">开始创建你的第一个残局吧</p>
              <Button
                type="primary"
                size="large"
                icon={<span className="i-mdi-plus text-base"></span>}
                onClick={handleAddGame}
              >
                添加对局
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;
