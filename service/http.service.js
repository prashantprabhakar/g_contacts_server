// @ts-check
const axios = require('axios')
const l = require('./logger.service')

exports.handleRequest = async({method, url, data, config}) => {
  try{
    if(method === 'GET') {
      l.info({
        method, url, data, config
      })
        let resp = await axios.get(url, {params: data, ...config})
        return await handleResponse(resp)
    }
    else if (method === 'POST') {
      let resp = await axios.post(url, data, )
      return await handleResponse(resp)
    }
    else if(method === 'DELETE') {
      let resp = await axios.delete(url, {data, ...config})
      return await handleResponse(resp)
    }

  } catch(error) {
      l.error(`Error in http call`, {error})
      return await handleResponse(error.response || error)
    }
}

const handleResponse = async(resp) => {
  try{
    let  { status } = resp
    if(!status) status = resp.response && resp.response.status
    if(resp.data && resp.data.error) {
      return {
        status: resp.data.error.code,
        message: resp.data.error.message,
      }
    }
    return { status, data: resp.data }
  } catch(error) {
    l.error(`Error in handling http response`, { error })
    return {success: false, message: 'Sorry something broke !!'}
  }

}


