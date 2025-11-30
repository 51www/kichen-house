<template>
  <div class="device-layout-designer">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <el-radio-group v-model="mode" size="large">
        <el-radio-button value="edit">编辑模式</el-radio-button>
        <el-radio-button value="view">显示模式</el-radio-button>
      </el-radio-group>

      <el-select
        v-model="selectedBackground"
        placeholder="选择画布背景"
        style="width: 200px; margin-left: 20px"
      >
        <el-option
          v-for="bg in canvasBackgrounds"
          :key="bg.id"
          :label="bg.name"
          :value="bg.id"
        />
      </el-select>

      <div style="margin-left: auto; display: flex; gap: 12px">
        <el-button type="success" :icon="Download" @click="saveCanvas">
          保存画布
        </el-button>
        <el-button type="warning" :icon="Upload" @click="loadCanvas">
          加载画布
        </el-button>
        <el-button type="primary" :icon="Delete" @click="clearCanvas">
          清空画布
        </el-button>
      </div>
    </div>

    <div class="designer-content">
      <!-- 左侧素材区 -->
      <div
        class="material-panel"
        v-if="mode === 'edit'"
        @dragover="(event) => event.preventDefault()"
      >
        <el-input
          v-model="searchText"
          placeholder="请输入搜索内容"
          :prefix-icon="Search"
          clearable
          style="margin-bottom: 16px"
        />

        <el-collapse v-model="activeCategories">
          <el-collapse-item
            v-for="category in deviceCategories"
            :key="category.id"
            :name="category.id"
          >
            <template #title>
              <span class="category-title">
                <span class="category-icon">{{ category.icon }}</span>
                {{ category.name }}
              </span>
            </template>

            <div class="device-grid">
              <div
                v-for="device in category.devices"
                :key="device.id"
                class="device-item"
                :class="{ dragging: draggingDeviceId === device.id }"
                draggable="true"
                @dragstart="handleDragStart($event, device)"
                @drag="handleDrag"
                @dragend="handleDragEnd"
              >
                <div class="device-icon">{{ device.icon }}</div>
                <div class="device-name">{{ device.name }}</div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- 右侧画布区 -->
      <div class="canvas-wrapper">
        <div
          ref="canvasRef"
          class="canvas-area"
          :class="{
            'view-mode': mode === 'view',
            'show-grid': showGrid,
          }"
          :style="canvasStyle"
          @dragover="handleDragOver"
          @drop="handleDrop"
          @click="handleCanvasClick"
        >
          <!-- 拖拽预览 -->
          <div
            v-if="dragPreview.show"
            class="drag-preview"
            :style="{
              left: dragPreview.x + 'px',
              top: dragPreview.y + 'px',
              width: dragPreview.width + 'px',
              height: dragPreview.height + 'px',
            }"
          >
            <div class="preview-icon">{{ dragPreview.icon }}</div>
          </div>

          <!-- 画布上的设备 -->
          <template v-for="device in canvasDevices" :key="device.instanceId">
            <div
              class="canvas-device"
              :class="{
                selected: selectedDeviceId === device.instanceId,
                'view-mode': mode === 'view',
              }"
              :style="{
                left: device.x + 'px',
                top: device.y + 'px',
                width: device.width + 'px',
                height: device.height + 'px',
                transform: `scale(${device.scale || 1})`,
              }"
              @click.stop="handleDeviceClick(device)"
              @mousedown="
                mode === 'edit' ? handleDeviceMouseDown($event, device) : null
              "
            >
              <div class="device-content">
                <el-tooltip class="box-item" :content="device.name">
                  <div
                    class="device-icon" 
                    :style="{ transform: 'scale(' + device.width / 80 + ')' }"
                  >
                    {{ device.icon }}
                  </div>
                </el-tooltip>
              </div>

              <!-- 选中边框和操作按钮 -->
              <template
                v-if="selectedDeviceId === device.instanceId && mode === 'edit'"
              >
                <div class="selection-border"></div>

                <div class="action-trigger">
                  <el-popover placement="right" :width="200" trigger="click">
                    <template #reference>
                      <el-icon><MoreFilled /></el-icon>
                    </template>
                    <div class="action-menu">
                      <div
                        class="menu-item"
                        @click.stop="handleSetRule(device)"
                      >
                        <el-icon><Setting /></el-icon>
                        <span>设置规则</span>
                      </div>
                      <div
                        class="menu-item"
                        @click.stop="handleSetParams(device)"
                      >
                        <el-icon><Document /></el-icon>
                        <span>设备参数</span>
                      </div>
                      <div class="menu-item" @click.stop="handleRepair(device)">
                        <el-icon><Tools /></el-icon>
                        <span>报修处理</span>
                      </div>
                      <div
                        class="menu-item danger"
                        @click.stop="handleDelete(device)"
                      >
                        <el-icon><Delete /></el-icon>
                        <span>删除</span>
                      </div>
                    </div>
                  </el-popover>
                </div>

                <!-- 缩放手柄 -->
                <div class="resize-handles">
                  <div
                    class="resize-handle bottom-right"
                    @mousedown.stop="handleResizeStart($event, device)"
                  ></div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 操作对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form label-width="100px">
        <el-form-item label="设备名称">
          <el-input v-model="currentDevice.name" disabled />
        </el-form-item>
        <el-form-item v-if="dialogType === 'rule'" label="规则配置">
          <el-input type="textarea" :rows="4" placeholder="请输入规则配置" />
        </el-form-item>
        <el-form-item v-if="dialogType === 'params'" label="设备参数">
          <el-input type="textarea" :rows="4" placeholder="请输入设备参数" />
        </el-form-item>
        <el-form-item v-if="dialogType === 'repair'" label="报修说明">
          <el-input type="textarea" :rows="4" placeholder="请输入报修说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 保存数据对话框 -->
    <el-dialog
      v-model="isSaveDialogVisible"
      title="画布数据(JSON)"
      width="600px"
    >
      <el-input
        v-model="jsonToSave"
        type="textarea"
        :rows="15"
        readonly
        style="font-family: monospace"
      />
      <template #footer>
        <el-button @click="isSaveDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="copyJsonData">复制数据</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import {
  Search,
  Delete,
  MoreFilled,
  Setting,
  Document,
  Tools,
  Download,
  Upload,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { deviceCategories, roomBackgrounds } from "../data/deviceData";

// 画布背景选项（包含网格）
const canvasBackgrounds = [
  { id: "grid", name: "网格", image: "white", showGrid: true },
  ...roomBackgrounds.filter((bg) => bg.id !== "none"),
  { id: "none", name: "纯白背景", image: "#ffffff", showGrid: false },
];

// 状态管理
const mode = ref("edit"); // edit | view
const searchText = ref("");
const activeCategories = ref(["kitchen"]);
const selectedBackground = ref("grid");
const canvasRef = ref(null);
const canvasDevices = ref([]);
const selectedDeviceId = ref(null);
const showActionMenu = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const dialogType = ref("");
const currentDevice = ref({});

let activeDragElement = null;
// 保存对话框状态
const isSaveDialogVisible = ref(false);
const jsonToSave = ref("");

// 拖拽状态
const dragPreview = reactive({
  show: false,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  icon: "",
});

let draggingDevice = null;
let isDraggingDevice = false;
let isResizing = false;
let dragOffset = { x: 0, y: 0 };
const draggingDeviceId = ref(null);

// 画布背景样式
const canvasStyle = computed(() => {
  const bg = canvasBackgrounds.find((b) => b.id === selectedBackground.value);
  // 当选择网格时，不设置内联背景，以便 CSS 类生效
  if (!bg || bg.id === "grid") {
    return {};
  }
  return { backgroundImage: bg.image };
});

// 是否显示网格
const showGrid = computed(() => {
  const bg = canvasBackgrounds.find((b) => b.id === selectedBackground.value);
  return bg?.showGrid || false;
});

var eventStart = null;
// 拖拽开始
const handleDragStart = (event, device) => {
  draggingDevice = device;
  draggingDeviceId.value = device.id; // 设置拖动状态
  event.dataTransfer.effectAllowed = "copy";

  // 设置自定义拖动图像
  const img = new Image();
  img.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  event.dataTransfer.setDragImage(img, 20, 20);
};
//拖拽进行中
const handleDrag = (event) => {
  console.log("run");
};

// 拖拽结束
const handleDragEnd = () => {
  dragPreview.show = false;
  draggingDevice = null;
  draggingDeviceId.value = null;

  // 清理拖动时创建的克隆元素
  if (activeDragElement) {
    document.body.removeChild(activeDragElement);
    activeDragElement = null;
  }
};

// 拖拽经过画布
const handleDragOver = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";

  if (draggingDevice && canvasRef.value) {
    const rect = canvasRef.value.getBoundingClientRect();
    dragPreview.show = true;
    dragPreview.x = event.clientX - rect.left - draggingDevice.width / 2;
    dragPreview.y = event.clientY - rect.top - draggingDevice.height / 2;
    dragPreview.width = draggingDevice.width;
    dragPreview.height = draggingDevice.height;
    dragPreview.icon = draggingDevice.icon;
  }
};

// 放置到画布
const handleDrop = (event) => {
  event.preventDefault();

  if (draggingDevice && canvasRef.value) {
    const rect = canvasRef.value.getBoundingClientRect();
    const x = Math.max(0, event.clientX - rect.left - draggingDevice.width / 2);
    const y = Math.max(0, event.clientY - rect.top - draggingDevice.height / 2);

    // 创建设备实例
    const deviceInstance = {
      ...draggingDevice,
      instanceId: `device-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      x,
      y,
      scale: 1,
    };
    console.log(deviceInstance, "ppp");
    canvasDevices.value.push(deviceInstance);
    ElMessage.success(`已添加 ${draggingDevice.name}`);
  }

  dragPreview.show = false;
  draggingDevice = null;
};

// 点击画布
const handleCanvasClick = () => {
  selectedDeviceId.value = null;
  showActionMenu.value = false;
};

// 点击设备
const handleDeviceClick = (device) => {
  if (mode.value === "edit") {
    selectedDeviceId.value = device.instanceId;
    showActionMenu.value = false;
  }
};

// 设备移动开始
const handleDeviceMouseDown = (event, device) => {
  if (
    event.target.closest(".resize-handle") ||
    event.target.closest(".action-trigger")
  ) {
    return;
  }

  isDraggingDevice = true;
  selectedDeviceId.value = device.instanceId;

  const rect = canvasRef.value.getBoundingClientRect();
  dragOffset.x = event.clientX - rect.left - device.x;
  dragOffset.y = event.clientY - rect.top - device.y;

  const handleMouseMove = (e) => {
    if (!isDraggingDevice) return;

    const rect = canvasRef.value.getBoundingClientRect();
    const newX = Math.max(
      0,
      Math.min(rect.width - device.width, e.clientX - rect.left - dragOffset.x)
    );
    const newY = Math.max(
      0,
      Math.min(rect.height - device.height, e.clientY - rect.top - dragOffset.y)
    );

    device.x = newX;
    device.y = newY;
  };

  const handleMouseUp = () => {
    isDraggingDevice = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};

// 缩放开始
const handleResizeStart = (event, device) => {
  isResizing = true;
  const startX = event.clientX;
  const startY = event.clientY;
  const startWidth = device.width;
  const startHeight = device.height;

  const handleMouseMove = (e) => {
    if (!isResizing) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    device.width = Math.max(30, startWidth + deltaX);
    device.height = Math.max(30, startHeight + deltaY);
  };

  const handleMouseUp = () => {
    isResizing = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};

// 设置规则
const handleSetRule = (device) => {
  currentDevice.value = device;
  dialogType.value = "rule";
  dialogTitle.value = "设置规则";
  dialogVisible.value = true;
  showActionMenu.value = false;
};

// 设备参数
const handleSetParams = (device) => {
  currentDevice.value = device;
  dialogType.value = "params";
  dialogTitle.value = "设备参数";
  dialogVisible.value = true;
  showActionMenu.value = false;
};

// 报修处理
const handleRepair = (device) => {
  currentDevice.value = device;
  dialogType.value = "repair";
  dialogTitle.value = "报修处理";
  dialogVisible.value = true;
  showActionMenu.value = false;
};

// 删除设备
const handleDelete = (device) => {
  const index = canvasDevices.value.findIndex(
    (d) => d.instanceId === device.instanceId
  );
  if (index > -1) {
    canvasDevices.value.splice(index, 1);
    selectedDeviceId.value = null;
    showActionMenu.value = false;
    ElMessage.success("设备已删除");
  }
};

// 清空画布
const clearCanvas = () => {
  canvasDevices.value = [];
  selectedDeviceId.value = null;
  ElMessage.success("画布已清空");
};

// 对话框确认
const handleDialogConfirm = () => {
  ElMessage.success("操作成功");
  dialogVisible.value = false;
};

// 保存画布数据
const saveCanvas = () => {
  if (canvasDevices.value.length === 0) {
    ElMessage.warning("画布为空，无需保存");
    return;
  }

  const canvasData = {
    version: "1.0",
    timestamp: new Date().toISOString(),
    background: selectedBackground.value,
    canvasSize: {
      width: canvasRef.value?.offsetWidth || 0,
      height: canvasRef.value?.offsetHeight || 0,
    },
    devices: canvasDevices.value.map((device) => ({
      instanceId: device.instanceId,
      deviceId: device.id,
      name: device.name,
      icon: device.icon,
      position: {
        x: device.x,
        y: device.y,
      },
      size: {
        width: device.width,
        height: device.height,
      },
      scale: device.scale || 1,
    })),
  };

  // 在对话框中显示 JSON
  jsonToSave.value = JSON.stringify(canvasData, null, 2);
  isSaveDialogVisible.value = true;
  //ElMessage.success("画布数据已生成");
};

// 复制 JSON 数据
const copyJsonData = async () => {
  try {
    await navigator.clipboard.writeText(jsonToSave.value);
    ElMessage.success("已复制到剪贴板");
  } catch (err) {
    console.error("复制失败: ", err);
    ElMessage.error("复制失败，请手动复制");
  }
};

// 加载画布数据
const loadCanvas = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const canvasData = JSON.parse(event.target.result);

        // 验证数据格式
        if (!canvasData.devices || !Array.isArray(canvasData.devices)) {
          throw new Error("无效的画布数据格式");
        }

        // 恢复背景
        if (canvasData.background) {
          selectedBackground.value = canvasData.background;
        }

        // 恢复设备
        canvasDevices.value = canvasData.devices.map((savedDevice) => ({
          ...savedDevice,
          id: savedDevice.deviceId,
          x: savedDevice.position.x,
          y: savedDevice.position.y,
          width: savedDevice.size.width,
          height: savedDevice.size.height,
          scale: savedDevice.scale || 1,
        }));

        ElMessage.success(`已加载 ${canvasDevices.value.length} 个设备`);
        console.log("加载的画布数据:", canvasData);
      } catch (error) {
        console.error("加载失败:", error);
        ElMessage.error("加载失败：" + error.message);
      }
    };

    reader.readAsText(file);
  };

  input.click();
};
</script>

<style scoped>
.device-layout-designer {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.toolbar {
  height: 60px;
  background: white;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.designer-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 左侧素材区 */
.material-panel {
  width: 320px;
  background: white;
  border-right: 1px solid #e4e7ed;
  padding: 16px;
  overflow-y: auto;
}

.category-title {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
}

.category-icon {
  font-size: 20px;
  margin-right: 8px;
}

.device-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 8px 0;
}

.device-item {
  aspect-ratio: 1;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: grab;
  transition: all 0.3s;
  user-select: none;
}

.device-item:hover {
  background: #ecf5ff;
  border-color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
}

.device-item:active {
  cursor: grabbing;
  transform: scale(0.95);
}

.device-item.dragging {
  opacity: 0.4;
  transform: scale(0.9);
  border-color: #409eff;
  background: #ecf5ff;
}

.device-item .device-icon {
  font-size: 32px;
  margin-bottom: 4px;
}

.device-item .device-name {
  font-size: 12px;
  color: #606266;
  text-align: center;
}

/* 画布区域 */
.canvas-wrapper {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

.canvas-area {
  width: 100%;
  min-height: 100%;
  background-color: white;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  position: relative;
  transition: background 0.3s;
}

/* 网格背景 */
.canvas-area.show-grid {
  background-image: linear-gradient(to right, #e0e0e0 1px, transparent 1px),
    linear-gradient(to bottom, #e0e0e0 1px, transparent 1px);
  background-size: 20px 20px;
}

.canvas-area.view-mode {
  border-style: solid;
  border-color: #909399;
}

/* 拖拽预览 */
.drag-preview {
  position: absolute;
  background: rgba(64, 158, 255, 0.1);
  border: 2px dashed #409eff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  animation: preview-pulse 0.6s ease-in-out infinite;
}

@keyframes preview-pulse {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

.preview-icon {
  font-size: 40px;
}

/* 画布上的设备 */
.canvas-device {
  position: absolute;
  cursor: move;
  transition: transform 0.2s;
  transform-origin: center;
}

.canvas-device.view-mode {
  cursor: default;
}

.device-content {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.canvas-device .device-icon {
  font-size: 36px;
  margin-bottom: 4px;
}

.canvas-device .device-name {
  font-size: 12px;
  font-weight: 500;
}

/* 选中状态 */
.canvas-device.selected .selection-border {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid #409eff;
  border-radius: 10px;
  pointer-events: none;
  animation: border-blink 1s ease-in-out infinite;
}

@keyframes border-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 操作触发器 */
.action-trigger {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 28px;
  height: 28px;
  background: #409eff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.4);
  z-index: 10;
}

.action-trigger:hover {
  background: #66b1ff;
  transform: scale(1.1);
}

/* 操作菜单 */
.menu-item {
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  transition: all 0.2s;
}

.menu-item:hover {
  background: #f5f7fa;
  color: #409eff;
}

.menu-item.danger:hover {
  background: #fef0f0;
  color: #f56c6c;
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: all 0.2s;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 缩放手柄 */
.resize-handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  width: 12px;
  height: 12px;
  background: white;
  border: 2px solid #409eff;
  border-radius: 50%;
  pointer-events: auto;
  cursor: nwse-resize;
}

.resize-handle.bottom-right {
  right: -6px;
  bottom: -6px;
}

.resize-handle:hover {
  background: #409eff;
  transform: scale(1.2);
}
</style>
