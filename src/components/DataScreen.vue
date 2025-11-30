<template>
  <div class="data-screen">
    <!-- 背景 -->
    <div class="background"></div>

    <!-- 头部区域 -->
    <div class="header">
      <div class="header-bg"></div>

      <!-- 左侧信息 -->
      <div class="header-left">
        <div class="date">2025.09.02</div>
        <div class="weekday">星期三</div>
      </div>

      <!-- 标题 -->
      <div class="header-title">智慧值守领导驾驶舱</div>

      <!-- 右侧信息 -->
      <div class="header-right">
        <div class="weather">17-28℃</div>
        <div class="time">{{ currentTime }}</div>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="filters">
      <el-select v-model="selectedArea" placeholder="选择片区" size="small">
        <el-option label="选择片区" value=""></el-option>
      </el-select>

      <el-select v-model="selectedProperty" placeholder="选择物业" size="small">
        <el-option label="选择物业" value=""></el-option>
      </el-select>

      <el-date-picker
        v-model="selectedDate"
        type="date"
        placeholder="选择时间"
        size="small"
      />

      <el-button type="primary" size="small" class="query-btn">查询</el-button>
      <el-button size="small" class="refresh-btn">
        <el-icon><Refresh /></el-icon>
        刷新
      </el-button>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 左侧面板 -->
      <div class="left-panel">
        <!-- 近7日平均值守情况趋势变化 -->
        <div class="chart-section">
          <div class="section-title">
            <div class="title-icon"></div>
            <span>近7日平均值守情况趋势变化</span>
          </div>
          <div class="chart-content">
            <div class="chart-info">
              <div class="info-label">近7日平均<br/>值守到岗率</div>
              <div class="info-value">74.3%</div>
            </div>
            <v-chart class="chart" :option="attendanceChartOption" autoresize />
          </div>
        </div>

        <!-- 近7日静止时长大于10分 -->
        <div class="chart-section">
          <div class="chart-content">
            <div class="chart-info">
              <div class="info-label">近7日静止<br/>时长大于10分</div>
              <div class="info-value green">72次</div>
            </div>
            <v-chart class="chart" :option="staticTimeChartOption" autoresize />
          </div>
        </div>

        <!-- 智慧桶站设备运行监视情况 -->
        <div class="chart-section">
          <div class="section-title">
            <div class="title-icon"></div>
            <span>智慧桶站设备运行监视情况</span>
          </div>
          <div class="monitor-content">
            <div class="monitor-item">
              <div class="monitor-label">监视占比</div>
              <div class="progress-circle">
                <svg width="180" height="180" viewBox="0 0 180 180">
                  <circle cx="90" cy="90" r="70" fill="none" stroke="rgba(27, 126, 242, 0.2)" stroke-width="20"/>
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#1B7EF2" stroke-width="20"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="circumference * (1 - 0.5)"
                    transform="rotate(-90 90 90)"/>
                  <text x="90" y="90" text-anchor="middle" dy=".3em" fill="white" font-size="24">50%</text>
                </svg>
              </div>
              <div class="monitor-stats">
                <div class="stat-item">
                  <span class="stat-label">智能桶站监视配比</span>
                </div>
                <div class="stat-detail">
                  <span class="stat-label">已监视桶站</span>
                  <span class="stat-value">3840 <span class="unit">个</span></span>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: 58%"></div>
                  </div>
                </div>
                <div class="stat-detail">
                  <span class="stat-label">未监视桶站</span>
                  <span class="stat-value">2786 <span class="unit">个</span></span>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: 42%"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="monitor-item">
              <div class="monitor-label">值守配比</div>
              <div class="progress-circle">
                <svg width="180" height="180" viewBox="0 0 180 180">
                  <circle cx="90" cy="90" r="70" fill="none" stroke="rgba(27, 126, 242, 0.2)" stroke-width="20"/>
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#23BE7D" stroke-width="20"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="circumference * (1 - 0.5)"
                    transform="rotate(-90 90 90)"/>
                  <text x="90" y="90" text-anchor="middle" dy=".3em" fill="white" font-size="24">50%</text>
                </svg>
              </div>
              <div class="monitor-stats">
                <div class="stat-item">
                  <span class="stat-label">智能桶站与值守人员配比</span>
                </div>
                <div class="stat-detail">
                  <span class="stat-label">智慧桶站数量</span>
                  <span class="stat-value">6725 <span class="unit">个</span></span>
                  <div class="progress-bar">
                    <div class="progress-fill green" style="width: 72%"></div>
                  </div>
                </div>
                <div class="stat-detail">
                  <span class="stat-label">值守人员数量</span>
                  <span class="stat-value">2561 <span class="unit">人</span></span>
                  <div class="progress-bar">
                    <div class="progress-fill green" style="width: 38%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="right-panel">
        <!-- 社区积分排行 -->
        <div class="chart-section">
          <div class="section-title">
            <div class="title-icon"></div>
            <span>社区积分排行</span>
          </div>
          <div class="community-grid">
            <div v-for="(community, index) in communities" :key="index" class="community-card">
              <div class="rank-badge" :class="getRankClass(index)">
                <img v-if="index < 3" :src="getRankIcon(index)" class="rank-icon" />
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div class="community-info">
                <div class="community-name">{{ community.name }}</div>
                <div class="community-score">
                  <span class="score">{{ community.score }}分</span>
                  <span class="score-change" :class="community.change >= 0 ? 'up' : 'down'">
                    {{ community.change >= 0 ? '+' : '' }}{{ community.change }}
                  </span>
                </div>
                <div class="community-desc">{{ community.desc }}</div>
                <div class="community-subinfo">{{ community.subinfo }}</div>
              </div>
              <div class="community-stats">
                <div class="stat-row">
                  <span class="stat-label">监视占比</span>
                  <span class="stat-value">{{ community.monitorRate }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">人员配比</span>
                  <span class="stat-value">{{ community.staffRate }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">到岗率</span>
                  <span class="stat-value">{{ community.attendanceRate }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">静止累计</span>
                  <span class="stat-value">{{ community.staticCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 积分排行日历 -->
        <div class="chart-section">
          <div class="section-title">
            <div class="title-icon"></div>
            <span>积分排行日历</span>
          </div>
          <div class="calendar-container">
            <div class="calendar-header">
              <el-button class="nav-btn">
                <el-icon><ArrowLeft /></el-icon>
              </el-button>
              <div class="month-tabs">
                <div v-for="month in months" :key="month"
                  class="month-tab"
                  :class="{ active: month === currentMonth }">
                  {{ month }}
                </div>
              </div>
              <el-button class="nav-btn">
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
            <div class="calendar-content">
              <div v-for="item in calendarData" :key="item.id" class="calendar-row">
                <span class="calendar-rank" :class="getRankClass(item.rank - 1)">{{ item.rank }}</span>
                <span class="calendar-community">{{ item.community }}</span>
                <span class="calendar-score">{{ item.score }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部背景 -->
    <div class="footer-bg"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Refresh, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 当前时间
const currentTime = ref('15:20:33')
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toTimeString().slice(0, 8)
}

let timer = null
onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// 筛选器
const selectedArea = ref('')
const selectedProperty = ref('')
const selectedDate = ref('')

// 圆周长
const circumference = computed(() => 2 * Math.PI * 70)

// 值守到岗率图表配置
const attendanceChartOption = ref({
  grid: {
    left: '15%',
    right: '5%',
    top: '15%',
    bottom: '15%'
  },
  xAxis: {
    type: 'category',
    data: ['10-12', '10-13', '10-14', '10-15', '10-16', '10-17', '10-18'],
    axisLine: {
      lineStyle: { color: '#1261BE', opacity: 0.5 }
    },
    axisLabel: {
      color: '#A7CDF9',
      fontSize: 16
    }
  },
  yAxis: {
    type: 'value',
    max: 100,
    axisLine: { show: false },
    axisLabel: {
      color: '#A7CDF9',
      fontSize: 16
    },
    splitLine: {
      lineStyle: { color: '#1261BE', opacity: 0.5 }
    }
  },
  series: [{
    data: [65, 70, 68, 72, 75, 68, 68.2],
    type: 'line',
    smooth: true,
    lineStyle: {
      color: '#1B7EF2',
      width: 3
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(27, 126, 242, 0.8)' },
          { offset: 1, color: 'rgba(27, 126, 242, 0.1)' }
        ]
      }
    },
    itemStyle: { color: '#1B7EF2' }
  }]
})

// 静止时长图表配置
const staticTimeChartOption = ref({
  grid: {
    left: '15%',
    right: '5%',
    top: '15%',
    bottom: '15%'
  },
  xAxis: {
    type: 'category',
    data: ['10-12', '10-13', '10-14', '10-15', '10-16', '10-17', '10-18'],
    axisLine: {
      lineStyle: { color: '#1760B6', opacity: 0.5 }
    },
    axisLabel: {
      color: '#A7CDF9',
      fontSize: 16
    }
  },
  yAxis: {
    type: 'value',
    max: 100,
    axisLine: { show: false },
    axisLabel: {
      color: '#A7CDF9',
      fontSize: 16
    },
    splitLine: {
      lineStyle: { color: '#1760B6', opacity: 0.5 }
    }
  },
  series: [{
    data: [60, 65, 70, 75, 80, 75, 72],
    type: 'line',
    smooth: true,
    lineStyle: {
      color: '#23BE7D',
      width: 3
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(35, 190, 125, 0.8)' },
          { offset: 1, color: 'rgba(35, 190, 125, 0.1)' }
        ]
      }
    },
    itemStyle: { color: '#23BE7D' }
  }]
})

// 社区数据
const communities = ref([
  {
    name: '社区名称A',
    score: '9.5',
    change: 0.5,
    desc: '最终获得积分总数的平均值',
    subinfo: '包含5个小区',
    monitorRate: '52.5%',
    staffRate: '49.2%',
    attendanceRate: '85.3%',
    staticCount: '6次'
  },
  {
    name: '社区名称B',
    score: '9.5',
    change: 0.5,
    desc: '最终获得积分总数的平均值',
    subinfo: '包含5个小区',
    monitorRate: '52.5%',
    staffRate: '49.2%',
    attendanceRate: '85.3%',
    staticCount: '6次'
  },
  {
    name: '社区名称C',
    score: '9.5',
    change: 0.5,
    desc: '最终获得积分总数的平均值',
    subinfo: '包含5个小区',
    monitorRate: '52.5%',
    staffRate: '49.2%',
    attendanceRate: '85.3%',
    staticCount: '6次'
  },
  {
    name: '社区名称A',
    score: '9.5',
    change: -0.5,
    desc: '最终获得积分总数的平均值',
    subinfo: '包含5个小区',
    monitorRate: '52.5%',
    staffRate: '49.2%',
    attendanceRate: '85.3%',
    staticCount: '6次'
  },
  {
    name: '社区名称B',
    score: '9.5',
    change: -0.5,
    desc: '最终获得积分总数的平均值',
    subinfo: '包含5个小区',
    monitorRate: '52.5%',
    staffRate: '49.2%',
    attendanceRate: '85.3%',
    staticCount: '6次'
  },
  {
    name: '社区名称C',
    score: '9.5',
    change: -0.5,
    desc: '最终获得积分总数的平均值',
    subinfo: '包含5个小区',
    monitorRate: '52.5%',
    staffRate: '49.2%',
    attendanceRate: '85.3%',
    staticCount: '6次'
  }
])

// 月份数据
const months = ['9月', '10月', '11月', '12月']
const currentMonth = ref('11月')

// 日历数据
const calendarData = ref([
  { id: 1, rank: 1, community: '小区名称A', score: '9.5分' },
  { id: 2, rank: 2, community: '小区名称B', score: '9.0分' },
  { id: 3, rank: 3, community: '小区名称C', score: '8.5分' }
])

// 获取排名样式类
const getRankClass = (index) => {
  if (index === 0) return 'rank-first'
  if (index === 1) return 'rank-second'
  if (index === 2) return 'rank-third'
  return 'rank-other'
}

// 获取排名图标（你需要准备相应的图标）
const getRankIcon = (index) => {
  // 这里应该返回实际的图标路径
  return ''
}
</script>

<style scoped>
.data-screen {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  font-family: 'PingFang SC', sans-serif;
}

.background {
  position: absolute;
  inset: 0;
  background: #000;
}

.background::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 71, 133, 0.8) 0%, rgba(0, 20, 40, 0.95) 100%);
  opacity: 0.8;
}

/* 头部区域 */
.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 102px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 89px;
  z-index: 10;
}

.header-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(27, 126, 242, 0.3) 0%, transparent 100%);
  border-bottom: 2px solid rgba(27, 126, 242, 0.5);
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 30px;
  z-index: 1;
}

.date,
.weekday,
.weather,
.time {
  font-size: 24px;
  color: #45A2FF;
}

.time {
  color: rgba(255, 255, 255, 0.87);
  text-shadow: 0 0 13px rgba(27, 126, 242, 0.91);
}

.header-title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 38px;
  font-weight: 600;
  color: white;
  text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  z-index: 1;
}

/* 筛选器 */
.filters {
  position: absolute;
  top: 107px;
  left: 53px;
  display: flex;
  gap: 25px;
  z-index: 10;
}

.filters :deep(.el-select),
.filters :deep(.el-date-picker) {
  width: 140px;
}

.filters :deep(.el-input__wrapper) {
  background: transparent;
  border: 1px solid #29F1FA;
  box-shadow: none;
}

.filters :deep(.el-input__inner) {
  color: white;
}

.query-btn,
.refresh-btn {
  background: #074196;
  border: 1px solid #29F1FA;
  color: white;
}

.refresh-btn {
  color: #29F1FA;
}

/* 主内容区域 */
.main-content {
  position: absolute;
  top: 155px;
  left: 40px;
  right: 40px;
  bottom: 50px;
  display: flex;
  gap: 20px;
}

.left-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-panel {
  width: 830px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 图表区块 */
.chart-section {
  background: rgba(27, 126, 242, 0.08);
  border: 1px solid rgba(27, 126, 242, 0.3);
  border-left: 4px solid #1B7EF2;
  padding: 20px;
  position: relative;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.87);
  text-shadow: 0 2px 24px rgba(27, 126, 242, 0.91);
}

.title-icon {
  width: 0;
  height: 27px;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 27px solid #1B7EF2;
  transform: rotate(90deg);
}

/* 图表内容 */
.chart-content {
  display: flex;
  align-items: center;
  gap: 30px;
  height: 250px;
}

.chart-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-width: 150px;
}

.info-label {
  font-size: 18px;
  color: white;
  text-align: center;
  line-height: 30px;
}

.info-value {
  font-size: 28px;
  font-weight: 600;
  color: #3190FF;
}

.info-value.green {
  color: #23BE7D;
}

.chart {
  flex: 1;
  height: 100%;
}

/* 监视情况 */
.monitor-content {
  display: flex;
  gap: 40px;
}

.monitor-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.monitor-label {
  font-size: 18px;
  color: white;
}

.progress-circle {
  position: relative;
}

.monitor-stats {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.stat-item {
  color: #B5C6FF;
  font-size: 18px;
  text-align: center;
}

.stat-detail {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.87);
  font-size: 16px;
}

.stat-value {
  color: rgba(255, 255, 255, 0.87);
  font-size: 18px;
}

.unit {
  color: rgba(255, 255, 255, 0.64);
  font-size: 16px;
}

.progress-bar {
  height: 8px;
  background: rgba(112, 112, 112, 0.23);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1B7EF2 0%, #29F1FA 100%);
  border-radius: 4px;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: radial-gradient(circle, #29F1FA 30%, transparent 30%);
  border: 2px solid #29F1FA;
  border-radius: 50%;
}

.progress-fill.green {
  background: linear-gradient(90deg, #23BE7D 0%, #32FF8C 100%);
}

.progress-fill.green::after {
  background: radial-gradient(circle, #32FF8C 30%, transparent 30%);
  border-color: #32FF8C;
}

/* 社区卡片网格 */
.community-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.community-card {
  background: rgba(27, 126, 242, 0.05);
  border: 1px solid #133761;
  border-top: 5px solid #0F898E;
  padding: 15px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.community-card:nth-child(3) {
  border-top-color: #29F1FA;
}

.rank-badge {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  color: white;
  position: absolute;
  top: 15px;
  left: 15px;
}

.rank-first {
  background: linear-gradient(135deg, #FFB200 0%, #FF8C00 100%);
}

.rank-second {
  background: linear-gradient(135deg, #C0C0C0 0%, #808080 100%);
}

.rank-third {
  background: linear-gradient(135deg, #3561FE 0%, #1B40C0 100%);
}

.rank-other {
  background: rgba(255, 255, 255, 0.1);
}

.rank-icon {
  width: 100%;
  height: 100%;
}

.community-info {
  padding-left: 50px;
}

.community-name {
  font-size: 14px;
  font-weight: 500;
  color: white;
  margin-bottom: 8px;
}

.community-score {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.score {
  font-size: 18px;
  font-weight: 600;
  color: #FFB200;
}

.score-change {
  font-size: 12px;
}

.score-change.up {
  color: #32FF8C;
}

.score-change.down {
  color: #EE6B02;
}

.community-desc {
  font-size: 12px;
  color: #1D83FA;
  margin-bottom: 4px;
}

.community-subinfo {
  font-size: 12px;
  color: #82A0A2;
}

.community-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 10px;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
}

.stat-row .stat-label {
  color: #0D6AE2;
}

.stat-row .stat-value {
  color: #29F1FA;
  font-size: 14px;
  font-weight: 600;
}

/* 日历 */
.calendar-container {
  padding: 10px;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.month-tabs {
  display: flex;
  gap: 20px;
}

.month-tab {
  padding: 8px 16px;
  font-size: 14px;
  color: #1E999F;
  cursor: pointer;
  transition: all 0.3s;
}

.month-tab.active {
  color: #29F1FA;
  font-weight: 600;
}

.nav-btn {
  background: transparent;
  border: none;
  color: #29F1FA;
}

.calendar-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.calendar-row {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 14px;
}

.calendar-rank {
  width: 30px;
  text-align: center;
  font-weight: 500;
}

.calendar-rank.rank-first {
  color: #FFB200;
}

.calendar-rank.rank-second {
  color: #B3B3B3;
}

.calendar-rank.rank-third {
  color: #3561FE;
}

.calendar-community {
  flex: 1;
  color: #0D6AE2;
}

.calendar-score {
  color: #1E999F;
}

/* 底部背景 */
.footer-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 28px;
  background: linear-gradient(180deg, transparent 0%, rgba(27, 126, 242, 0.3) 100%);
  border-top: 2px solid rgba(27, 126, 242, 0.5);
}
</style>
