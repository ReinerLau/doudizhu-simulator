import { Button, Input, Card, Dropdown, Row, Col, message, Modal } from "antd";
import type { MenuProps } from "antd";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import GameDatabaseService from "../services/gameDatabase";
import type { Game } from "../types";

/**
 * 首页组件
 * 展示对局列表、搜索、上传下载等功能
 */
function HomePage() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // 搜索关键词状态
  const [searchKeyword, setSearchKeyword] = useState("");

  // 对局列表状态
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 筛选后的对局列表
  const filteredGames = useMemo(() => {
    if (!searchKeyword.trim()) {
      return games;
    }
    return games.filter((game) =>
      game.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [games, searchKeyword]);

  /**
   * 初始化数据库并加载对局数据
   */
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        // 初始化数据库
        await GameDatabaseService.initializeDatabase();

        // 加载所有对局
        const allGames = await GameDatabaseService.getAllGames();
        setGames(allGames);
      } catch (error) {
        console.error("初始化数据失败:", error);
        messageApi.error("加载对局数据失败");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  /**
   * 重新加载对局列表
   */
  const reloadGames = async () => {
    try {
      const allGames = await GameDatabaseService.getAllGames();
      setGames(allGames);
    } catch (error) {
      console.error("重新加载对局失败:", error);
      messageApi.error("重新加载对局失败");
    }
  };

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
        handleDeleteGame(gameId);
        break;
      case "download":
        handleDownloadGame(gameId);
        break;
    }
  };

  /**
   * 删除对局
   * @param gameId - 对局ID
   */
  const handleDeleteGame = (gameId: number) => {
    const game = games.find((g) => g.id === gameId);
    if (!game) return;

    Modal.confirm({
      title: "确认删除",
      content: `确定要删除对局 "${game.title}" 吗？此操作不可撤销。`,
      okText: "确定",
      cancelText: "取消",
      okType: "danger",
      onOk: async () => {
        try {
          await GameDatabaseService.deleteGame(gameId);
          messageApi.success("对局删除成功");
          await reloadGames();
        } catch (error) {
          console.error("删除对局失败:", error);
          messageApi.error("删除对局失败");
        }
      },
    });
  };

  /**
   * 下载单个对局
   * @param gameId - 对局ID
   */
  const handleDownloadGame = async (gameId: number) => {
    try {
      const game = games.find((g) => g.id === gameId);
      if (!game) {
        messageApi.error("对局不存在");
        return;
      }

      const dataStr = JSON.stringify([game], null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });

      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${game.title}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      messageApi.success("对局下载成功");
    } catch (error) {
      console.error("下载对局失败:", error);
      messageApi.error("下载对局失败");
    }
  };

  /**
   * 下载所有对局
   */
  const handleDownloadAllGames = async () => {
    try {
      if (games.length === 0) {
        messageApi.warning("暂无对局可下载");
        return;
      }

      const dataStr = JSON.stringify(games, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });

      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "doudizhu-games.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      messageApi.success(`成功下载 ${games.length} 个对局`);
    } catch (error) {
      console.error("下载所有对局失败:", error);
      messageApi.error("下载所有对局失败");
    }
  };

  /**
   * 上传对局文件
   */
  const handleUploadGames = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const importedGames = JSON.parse(text);

        if (!Array.isArray(importedGames)) {
          messageApi.error("文件格式错误：应为对局数组");
          return;
        }

        // 验证数据格式
        for (const game of importedGames) {
          if (!game.title || !game.cards || !game.firstPlayer) {
            messageApi.error("文件格式错误：缺少必要字段");
            return;
          }
        }

        // 导入数据（移除ID让数据库自动分配）
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const gamesWithoutId = importedGames.map(({ id, ...rest }) => rest);
        const importedIds = await GameDatabaseService.importGames(
          gamesWithoutId
        );

        messageApi.success(`成功导入 ${importedIds.length} 个对局`);
        await reloadGames();
      } catch (error) {
        console.error("上传对局失败:", error);
        messageApi.error("上传对局失败：文件格式错误");
      }
    };
    input.click();
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

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-2">正在加载对局数据...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 p-6">
      {contextHolder}
      {/* 操作栏 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <Row gutter={[16, 16]} align="middle">
          {/* 搜索框 */}
          <Col xs={24} sm={18}>
            <Input
              placeholder="搜索对局标题..."
              size="large"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </Col>

          {/* 操作按钮 */}
          <Col xs={8} sm={2}>
            <Button size="large" className="w-full" onClick={handleUploadGames}>
              <span>上传对局</span>
            </Button>
          </Col>

          <Col xs={8} sm={2}>
            <Button
              size="large"
              className="w-full"
              onClick={handleDownloadAllGames}
            >
              <span>下载对局</span>
            </Button>
          </Col>

          <Col xs={8} sm={2}>
            <Button
              type="primary"
              size="large"
              onClick={handleAddGame}
              className="w-full"
            >
              <span>添加对局</span>
            </Button>
          </Col>
        </Row>
      </div>

      {/* 对局卡片网格 */}
      <Row gutter={[16, 16]}>
        {filteredGames.map((game) => (
          <Col key={game.id} xs={24} sm={6}>
            <Card
              hoverable
              className="cursor-pointer transition-all duration-200 hover:shadow-md relative"
              onClick={() => handleCardClick(game.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 flex items-center justify-center">
                  <h3 className="text-lg">{game.title}</h3>
                </div>
              </div>
              {/* 更多操作按钮 */}
              <Dropdown menu={getContextMenu(game.id)} trigger={["click"]}>
                <Button
                  type="text"
                  size="small"
                  className="absolute top-2 right-2 p-1 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation(); // 阻止事件冒泡，避免触发卡片点击
                  }}
                  icon={
                    <div className="i-mdi-dots-horizontal  text-base"></div>
                  }
                />
              </Dropdown>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 空状态提示 */}
      {filteredGames.length === 0 && (
        <div className="text-center py-16">
          {searchKeyword ? (
            <>
              <div className="mb-4">
                <span className="i-mdi-magnify text-6xl text-gray-300"></span>
              </div>
              <h3 className="text-xl text-gray-500 mb-2">未找到相关对局</h3>
              <p className="text-gray-400 mb-6">
                尝试使用其他关键词搜索，或者清空搜索框查看所有对局
              </p>
              <Button onClick={() => setSearchKeyword("")}>清空搜索</Button>
            </>
          ) : games.length === 0 ? (
            <>
              <div className="mb-6">
                <span className="i-mdi-cards-playing text-8xl text-blue-200"></span>
              </div>
              <h3 className="text-2xl text-gray-700 mb-3">
                欢迎使用斗地主模拟器
              </h3>
              <p className="text-gray-500 mb-2">
                这里还没有任何对局，让我们开始创建你的第一个残局吧！
              </p>
              <p className="text-gray-400 text-sm mb-8">
                你可以创建新对局，或者上传已有的对局文件
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  type="primary"
                  size="large"
                  icon={<span className="i-mdi-plus text-base"></span>}
                  onClick={handleAddGame}
                >
                  创建第一个对局
                </Button>
                <Button
                  size="large"
                  icon={<span className="i-mdi-upload text-base"></span>}
                  onClick={handleUploadGames}
                >
                  上传对局文件
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <span className="i-mdi-playlist-remove text-6xl text-gray-300"></span>
              </div>
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
