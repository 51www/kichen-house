// 设备素材数据
export const deviceCategories = [
  {
    id: "layout",
    name: "布局",
    icon: "🔳",
    devices: [
      {
        id: "room-1",
        name: "操作间",
        icon: "⬜️",
        width: 200,
        height: 200,
        type: "room",
      },
    ],
  },
  
  {
    id: "kitchen",
    name: "智能设备",
    icon: "🍳",
    devices: [
      { id: "gas-stove", name: "燃气灶", icon: "🔥", width: 80, height: 60 },
      { id: "sink-1", name: "水池1", icon: "🚰", width: 80, height: 60 }, 
      {
        id: "basin-sink",
        name: "带基座水池",
        icon: "🚽",
        width: 170,
        height: 100,
      },
      { id: "cabinet-1", name: "直立水池1", icon: "🗄️", width: 60, height: 80 }, 
      { id: "shower-1", name: "桶刷", icon: "🚿", width: 90, height: 90 }, 
      { id: "bathtub", name: "自由水池", icon: "🛀", width: 120, height: 70 },
    ],
  },
];

// 背景房间样式
export const roomBackgrounds = [
  {
    id: "living-room",
    name: "客厅",
    image: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  },
  {
    id: "bedroom",
    name: "卧室",
    image: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  },
  {
    id: "kitchen",
    name: "厨房",
    image: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  },
  {
    id: "bathroom",
    name: "卫生间",
    image: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
  },
  { id: "none", name: "无背景", image: "#ffffff" },
];
