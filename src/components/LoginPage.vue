<template>
  <div class="login-container">
    <!-- 左侧宣传区域 -->
    <div class="left-section">
      <div class="left-content">
        <!-- Logo图标 -->
        <div class="logo-icon">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2L4 12V28L20 38L36 28V12L20 2Z" fill="#3562FF" opacity="0.2"/>
            <path d="M20 10L10 16V24L20 30L30 24V16L20 10Z" fill="#3562FF"/>
            <path d="M20 15L16 17.5V22.5L20 25L24 22.5V17.5L20 15Z" fill="white"/>
          </svg>
        </div>

        <!-- 标题 -->
        <h1 class="main-title">值守无忧，智慧赋能</h1>
        <p class="subtitle">强调系统对值守工作的减负与智能化支持</p>

        <!-- 3D插图 -->
        <div class="illustration">
          <img :src="illustrationImage" alt="3D illustration" />
        </div>
      </div>
    </div>

    <!-- 右侧登录表单区域 -->
    <div class="right-section">
      <div class="login-form-wrapper">
        <!-- 平台标题 -->
        <div class="platform-header">
          <div class="platform-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="#3562FF" stroke-width="2" fill="none"/>
              <circle cx="12" cy="12" r="3" fill="#3562FF"/>
            </svg>
          </div>
          <h2 class="platform-title">智慧值守管理平台</h2>
        </div>

        <!-- 登录表单 -->
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="rules"
          class="login-form"
        >
          <!-- 账号 -->
          <el-form-item prop="account" class="form-item">
            <label class="form-label">账号</label>
            <el-input
              v-model="loginForm.account"
              placeholder="132 4548 1323"
              size="large"
              class="form-input"
            />
          </el-form-item>

          <!-- 密码 -->
          <el-form-item prop="password" class="form-item">
            <label class="form-label">密码</label>
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="**********"
              size="large"
              show-password
              class="form-input"
            />
          </el-form-item>

          <!-- 验证码 -->
          <el-form-item prop="captcha" class="form-item">
            <label class="form-label">验证码</label>
            <div class="captcha-wrapper">
              <el-input
                v-model="loginForm.captcha"
                placeholder="BYHQ"
                size="large"
                class="form-input captcha-input"
              />
              <div class="captcha-code" @click="refreshCaptcha">
                <canvas ref="captchaCanvas" width="107" height="56"></canvas>
              </div>
            </div>
          </el-form-item>

          <!-- 登录按钮 -->
          <el-button
            type="primary"
            size="large"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>

          <!-- 忘记密码 -->
          <div class="forgot-password">
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form>

        <!-- 版权信息 -->
        <div class="copyright">
          @知识产权和技术支持文字站位
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

// 路由
const router = useRouter()

// 表单引用
const loginFormRef = ref(null)
const captchaCanvas = ref(null)

// 加载状态
const loading = ref(false)

// 插图图片（这里使用从Figma获取的URL，你也可以替换为本地图片）
const illustrationImage = ref('https://www.figma.com/api/mcp/asset/cc4c15d8-a461-4a01-b0ca-51d2bdf97d05')

// 表单数据
const loginForm = reactive({
  account: '',
  password: '',
  captcha: ''
})

// 验证码文本
const captchaText = ref('')

// 表单验证规则
const rules = {
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value.toUpperCase() !== captchaText.value.toUpperCase()) {
          callback(new Error('验证码错误'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 生成验证码
const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let text = ''
  for (let i = 0; i < 4; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return text
}

// 绘制验证码
const drawCaptcha = () => {
  if (!captchaCanvas.value) return

  const canvas = captchaCanvas.value
  const ctx = canvas.getContext('2d')

  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 设置背景
  ctx.fillStyle = '#f2f2f2'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 生成新的验证码文本
  captchaText.value = generateCaptcha()

  // 绘制验证码文字
  const colors = ['#3562FF', '#9035FF', '#E735FF', '#FF358D']
  const text = captchaText.value

  for (let i = 0; i < text.length; i++) {
    ctx.save()

    // 随机颜色
    ctx.fillStyle = colors[i % colors.length]

    // 随机字体大小
    const fontSize = 20 + Math.random() * 8
    ctx.font = `bold ${fontSize}px 'Figma Hand', Arial`

    // 随机旋转角度
    const angle = (Math.random() - 0.5) * 0.3

    // 计算位置
    const x = 15 + i * 22
    const y = 35

    ctx.translate(x, y)
    ctx.rotate(angle)

    // 绘制文字
    ctx.fillText(text[i], 0, 0)

    ctx.restore()
  }

  // 添加干扰线
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)]
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
    ctx.stroke()
  }

  // 添加干扰点
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
    ctx.beginPath()
    ctx.arc(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      1,
      0,
      2 * Math.PI
    )
    ctx.fill()
  }
}

// 刷新验证码
const refreshCaptcha = () => {
  drawCaptcha()
  loginForm.captcha = ''
}

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()

    loading.value = true

    // 模拟登录请求
    setTimeout(() => {
      loading.value = false
      ElMessage.success('登录成功！')

      // 跳转到数字大屏页面
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)
    }, 1500)

  } catch (error) {
    console.log('表单验证失败:', error)
  }
}

// 组件挂载时绘制验证码
onMounted(() => {
  drawCaptcha()
})
</script>

<style scoped>
.login-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background: white;
}

/* 左侧宣传区域 */
.left-section {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.left-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('https://www.figma.com/api/mcp/asset/cc4c15d8-a461-4a01-b0ca-51d2bdf97d05');
  background-size: cover;
  background-position: center;
  opacity: 0.95;
}

.left-content {
  position: relative;
  z-index: 1;
  padding: 60px;
  max-width: 600px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 30px;
}

.main-title {
  font-size: 30px;
  color: #F7F9FC;
  font-weight: 400;
  margin-bottom: 15px;
  font-family: 'STSong', serif;
}

.subtitle {
  font-size: 20px;
  color: white;
  font-weight: 300;
  margin-bottom: 40px;
  line-height: 1.6;
}

.illustration {
  margin-top: 60px;
  opacity: 0.9;
}

.illustration img {
  width: 100%;
  max-width: 500px;
  height: auto;
}

/* 右侧登录表单区域 */
.right-section {
  width: 50%;
  max-width: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: white;
}

.login-form-wrapper {
  width: 100%;
  max-width: 380px;
}

/* 平台标题 */
.platform-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 60px;
}

.platform-icon {
  width: 32px;
  height: 32px;
}

.platform-title {
  font-size: 32px;
  color: #3562FF;
  font-weight: 600;
  margin: 0;
}

/* 表单样式 */
.login-form {
  width: 100%;
}

.form-item {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  font-size: 17px;
  color: #1E1E1E;
  font-weight: 500;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.form-input :deep(.el-input__wrapper) {
  background: #F2F2F2;
  border-radius: 8px;
  padding: 16px;
  box-shadow: none;
  border: none;
  height: 56px;
}

.form-input :deep(.el-input__inner) {
  color: #3B3B3B;
  font-size: 16px;
}

.form-input :deep(.el-input__inner::placeholder) {
  color: #999;
}

/* 验证码样式 */
.captcha-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
}

.captcha-input {
  flex: 1;
}

.captcha-code {
  width: 107px;
  height: 56px;
  background: #F2F2F2;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  transition: opacity 0.3s;
}

.captcha-code:hover {
  opacity: 0.8;
}

.captcha-code canvas {
  display: block;
  width: 100%;
  height: 100%;
}

/* 登录按钮 */
.login-button {
  width: 100%;
  height: 56px;
  background: #3562FF;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: 700;
  margin-top: 35px;
  transition: all 0.3s;
}

.login-button:hover {
  background: #2651eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(53, 98, 255, 0.3);
}

.login-button:active {
  transform: translateY(0);
}

/* 忘记密码 */
.forgot-password {
  text-align: center;
  margin-top: 20px;
}

.forgot-password :deep(.el-link) {
  font-size: 14px;
  color: #3562FF;
}

/* 版权信息 */
.copyright {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-top: 60px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .login-container {
    flex-direction: column;
  }

  .left-section {
    height: 300px;
  }

  .left-content {
    padding: 40px;
  }

  .illustration {
    display: none;
  }

  .right-section {
    width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .right-section {
    padding: 20px;
  }

  .platform-title {
    font-size: 24px;
  }

  .main-title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 16px;
  }
}
</style>
