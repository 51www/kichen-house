// 设备素材数据
export const deviceCategories = [
  {
    id: 'door',
    name: '门窗',
    icon: '🚪',
    devices: [
      { id: 'door-1', name: '双开门', icon: '🚪', width: 80, height: 100 },
      { id: 'door-2', name: '单开门', icon: '🚪', width: 60, height: 100 },
      { id: 'door-3', name: '推拉门', icon: '🚪', width: 120, height: 100 },
      { id: 'window-1', name: '窗户', icon: '🪟', width: 100, height: 60 }
    ]
  },
  {
    id: 'furniture',
    name: '家具',
    icon: '🛋️',
    devices: [
      { id: 'sofa-1', name: '沙发', icon: '🛋️', width: 150, height: 80 },
      { id: 'table-1', name: '餐桌', icon: '🪑', width: 120, height: 80 }
    ]
  },
  {
    id: 'kitchen',
    name: '厨房和卫生间',
    icon: '🍳',
    devices: [
      { id: 'gas-stove', name: '燃气灶', icon: '🔥', width: 80, height: 60 },
      { id: 'sink-1', name: '水池1', icon: '🚰', width: 80, height: 60 },
      { id: 'sink-2', name: '水池2', icon: '🚿', width: 70, height: 60 },
      { id: 'sink-3', name: '水池3', icon: '🚰', width: 90, height: 70 },
      { id: 'sink-4', name: '水池4', icon: '💧', width: 101, height: 83 },
      { id: 'basin-sink', name: '带基座水池', icon: '🚽', width: 170, height: 100 },
      { id: 'cabinet-1', name: '直立水池1', icon: '🗄️', width: 60, height: 80 },
      { id: 'cabinet-2', name: '直立水池2', icon: '📦', width: 65, height: 85 },
      { id: 'shower-1', name: '淋浴间', icon: '🚿', width: 90, height: 90 },
      { id: 'shower-2', name: '方形淋浴间', icon: '🛁', width: 100, height: 100 },
      { id: 'bathtub', name: '自由水池', icon: '🛀', width: 120, height: 70 }
    ]
  }
];

// 背景房间样式
export const roomBackgrounds = [
  { id: 'living-room', name: '客厅', image: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
  { id: 'bedroom', name: '卧室', image: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  { id: 'kitchen', name: '厨房', image: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' },
  { id: 'bathroom', name: '卫生间', image: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
  { id: 'none', name: '无背景', image: '#ffffff' }
];
