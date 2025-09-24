import { Button, Input, Card, Upload, Dropdown, Space } from "antd";
import type { MenuProps } from "antd";

// 模拟对局数据
const mockGames = [
  { id: 1, title: "经典残局 - 春天" },
  { id: 2, title: "高级残局 - 反春" },
  { id: 3, title: "入门残局 - 基础出牌" },
  { id: 4, title: "困难残局 - 炸弹连环" },
  { id: 5, title: "中级残局 - 顺子组合" },
  { id: 6, title: "专家残局 - 王炸决胜" },
];

function App() {
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
  });

  return (
    <div className="h-screen bg-gray-50 p-6">
      {/* 操作栏 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* 搜索框 */}
          <div className="flex-1 max-w-md">
            <Input.Search
              placeholder="搜索残局标题..."
              size="large"
              className="w-full"
              prefix={<span className="i-mdi-magnify text-gray-400"></span>}
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
            >
              添加对局
            </Button>
          </Space>
        </div>
      </div>

      {/* 对局卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockGames.map((game) => (
          <Dropdown
            key={game.id}
            menu={getContextMenu(game.id)}
            trigger={["contextMenu"]}
          >
            <Card
              hoverable
              className="cursor-pointer transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 flex items-center justify-center">
                  <h3 className="text-lg ">{game.title}</h3>
                </div>
              </div>
            </Card>
          </Dropdown>
        ))}
      </div>

      {/* 空状态提示 */}
      {mockGames.length === 0 && (
        <div className="text-center py-16">
          <div className="i-mdi-cards-outline text-6xl text-gray-300 mb-4"></div>
          <h3 className="text-xl text-gray-500 mb-2">暂无对局</h3>
          <p className="text-gray-400 mb-6">开始创建你的第一个残局吧</p>
          <Button
            type="primary"
            size="large"
            icon={<span className="i-mdi-plus text-base"></span>}
          >
            添加对局
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;
