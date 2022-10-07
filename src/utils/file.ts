import dayjs from 'dayjs'
import { EXPORT_TYPE } from '../configs/constants'

const triggerDownloadLink = (url: string, fileName: string, type: string) => {
  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName}-${dayjs().format('YYYY-MM-DD')}.${type}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const downloadFileFromBlob = (
  blobFile: Blob,
  fileName: string,
  type: string
) => {
  let url
  if (type === EXPORT_TYPE.EXCEL) {
    url = window.URL.createObjectURL(
      new Blob([blobFile], {
        type: 'application/octet-stream',
      })
    )
  } else {
    // json
    url = window.URL.createObjectURL(
      new Blob([blobFile], {
        type: 'application/json',
      })
    )
  }

  triggerDownloadLink(url, fileName, type)
  return true
}

// export const downloadJsonFile = (
//   data: Definition[] | DataSet[],
//   fileName: string
// ) => {
//   const url =
//     'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data))
//   triggerDownloadLink(url, fileName, EXPORT_TYPE.JSON)
//   return true
// }
