import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const validateStatus = function (status: number): boolean {
  return status >= 200 && status < 300 // default
}

const rConfig = {
  timeout: 5000,
  validateStatus,
  headers: {
    'Content-Type': 'application/json'
  }
}

export const submitRequest = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  return await new Promise((resolve, reject) => {
    axios({
      ...rConfig,
      ...config
    }).then((res: AxiosResponse) => {
      if (res.data !== undefined) {
        resolve(res)
      } else {
        reject(new Error(`${config.url ?? ''}: null response`))
      }
    }).catch(error => {
      reject(new Error(error))
    })
  })
}

export const sendEmail = async (data: any, file: FormData): Promise<any> => {
  const url = 'http://localhost:8081/sendMail'
  const result = await submitRequest({
    method: 'POST',
    url,
    timeout: 15000,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: file

  })
  return result.data
}

// 文件大小
export const formatFileSize = (size: number): string => {
  const kb = size / 1024
  const mb = kb / 1024
  if (mb > 1) {
    return `${mb.toFixed(2)} MB`
  } else if (kb > 1) {
    return `${kb.toFixed(2)} KB`
  } else {
    return `${size} bytes`
  }
}
