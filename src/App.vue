<template>
  <div class="flex flex-1 flex-col items-center justify-center h-screen">
    <h1 class="text-3xl mb-6">
      发送 Gmail 邮件
    </h1>
    <div class="flex items-center ">
      <div class="mx-auto flex items-center mb-4">
        <div class="p-2 rounded-xl mr-6 cursor-pointer" :class="uploadData.contentType === 'text/plain' ? 'bg-blue1 text-white' : 'bg-black bg-opacity-25'" @click="changeUploadContentType('text/plain')">
          text/plain 邮件
        </div>
        <div class=" p-2 rounded-xl cursor-pointer" :class="uploadData.contentType === 'text/html' ? 'bg-blue1 text-white' : 'bg-black bg-opacity-25'" @click="changeUploadContentType('text/html')">
          text/html 邮件
        </div>
      </div>
    </div>
    <div class="flex items-center flex-col px-24 w-full">
      <div class="flex flex-row w-full  mb-4">
        <!-- 账户 -->
        <div class="whitespace-nowrap " style="min-width: 140px;">
          *请输入账号:
        </div>
        <input
          id=""
          v-model="uploadData.from"
          type="text"
          required
          class="outline-none border border-gray1 rounded-lg w-full px-4 py-px">
      </div>
      <!-- 应用专用密码 -->
      <div class="flex flex-row w-full  mb-4">
        <div class="whitespace-nowrap " style="min-width: 140px;">
          *请输入应用密码:
        </div>
        <input
          id=""
          v-model="uploadData.password"
          type="text"
          required
          class="outline-none border border-gray1 rounded-lg w-full px-4 py-px">
      </div>
      <!-- 接收者账户 -->
      <div class="flex flex-row w-full  mb-4">
        <div class="whitespace-nowrap " style="min-width: 140px;">
          *请输入接收者:
        </div>
        <input
          id=""
          v-model="uploadData.to"
          type="text"
          required
          class="outline-none border border-gray1 rounded-lg w-full px-4 py-px">
      </div>
      <!-- 邮件主题 Title-->
      <div class="flex flex-row w-full  mb-4">
        <div class="whitespace-nowrap " style="min-width: 140px;">
          *请输入邮件标题:
        </div>
        <input
          id=""
          v-model="uploadData.title"
          type="text"
          required
          class="outline-none border border-gray1 rounded-lg w-full px-4 py-px">
      </div>
      <!-- 邮件内容 -->
      <div v-if="uploadData.contentType === 'text/plain'" class="flex flex-row w-full mb-4">
        <div class="whitespace-nowrap" style="min-width: 140px;">
          *请输入邮件内容:
        </div>
        <div class="flex items-center flex-1">
          <textarea v-model="uploadData.emailContent" required class="outline-none border border-gray1 rounded-lg w-full h-24 p-4" />
        </div>
      </div>
      <div v-else class="flex flex-row w-full mb-4">
        <div class="whitespace-nowrap" style="min-width: 140px;">
          *请选择 HTML 文件:
        </div>
        <div class="flex items-center">
          <label for="fileInput" class="bg-black bg-opacity-25 p-2 rounded-xl mr-6 cursor-pointer">选择文件</label>
          <input
            id="fileInput"
            type="file"
            name="myfile"
            class="text-transparent fileInput"
            accept=".html"
            size="100"
            @change="onFileSelected">
          <div v-if="htmlFile">
            {{ htmlFile?.name }} : {{ formatFileSize(htmlFile?.size ?? 0) }}
          </div>
        </div>
      </div>
      <!-- 添加附件 -->
      <div class="flex flex-row w-full">
        <div class="whitespace-nowrap" style="min-width: 140px;">
          请选择添加附件:
        </div>
        <div class="">
          <label for="attachment" class="bg-black bg-opacity-25 p-2 rounded-xl mr-6 cursor-pointer block w-max">选择附件</label>
          <input
            id="attachment"
            type="file"
            name="myfile"
            class="text-transparent fileInput"
            size="100"
            multiple
            @change="uploadAttachments">
          <div v-if="testAttachmentsArr.length" class="mt-4">
            <div v-for="(attachment,index) in testAttachmentsArr" :key="index">
              {{ attachment?.name }} : {{ formatFileSize(attachment?.size ?? 0) }}
            </div>
          </div>
        </div>
      </div>

      <div class="cursor-pointer bg-blue1 p-2 rounded-lg text-white mt-6 w-40 text-center" @click="sendTextEmail">
        发送
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { sendEmail, formatFileSize } from '@/libs/index'

const uploadData = reactive({
  from: 'xxx@gmail.com', // 发送者
  password: '', // 应用专用密码
  to: ['xxx@gmail.com'], // 接收者
  title: '',
  contentType: 'text/plain',
  emailContent: ''
})

const changeUploadContentType = (type:'text/plain' | 'text/html') => {
  // 切换状态
  uploadData.contentType = type
  // 重置 附件
  formData.value = new FormData()
  testAttachmentsArr.value = []
  // 重置 html 模版文件
  htmlFile.value = null
  htmlFileContent.value = ''
  // 重置 邮件内容
  uploadData.emailContent = ''
}

// 发送邮件
const sendTextEmail = async () => {
  console.log(uploadData)
  if (uploadData.from && uploadData.password && uploadData.to && uploadData.contentType && uploadData.title) {
    // 将 formData 中数据进行更新
    Object.entries(uploadData).forEach(([key, value]) => {
      if (formData.value.get(key) !== null) {
        formData.value.delete(key)
      }
      formData.value.append(key, value.toString())
    })
    try {
      const data = await sendEmail(uploadData, formData.value)
      console.log(data)
    } catch (e) {
      console.log(e)
    }
  } else {
    console.log('参数不全')
    alert('参数不全')
  }
}

// 附件 FormData
const formData = ref(new FormData())
const testAttachmentsArr = ref<File[]>([])
// 上传附件
const uploadAttachments = (event:Event) => {
  const target = event.target as HTMLInputElement
  if (target.files !== null) {
    for (let i = 0; i < target.files.length; i++) {
      testAttachmentsArr.value.push(target.files[i])
    }
  }
  for (let i = 0; i < testAttachmentsArr.value.length; i++) {
    formData.value.append(`file${i}`, testAttachmentsArr.value[i])
  }
  console.log(testAttachmentsArr.value)
}

// html 内容
const htmlFileContent = ref('')
const htmlFile = ref<File | null>(null)
const onFileSelected = async (event: Event) => {
  const target = event.target as HTMLInputElement
  htmlFile.value = (target.files as FileList)[0]
  const reader = new FileReader()
  reader.onload = (e) => {
    htmlFileContent.value = e.target?.result as string
    uploadData.emailContent = htmlFileContent.value
  }
  reader.readAsText(htmlFile.value)
}

</script>

<style lang="scss">
.fileInput {
  display: none;
}
</style>
