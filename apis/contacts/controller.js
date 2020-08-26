
const { fetchListFromGoogleApi, deleteContactFromGoogle } = require('../../service/contacts.servcie')
const l = require('../../service/logger.service')

const fetchContactList = async(req, res) => {
    try {
        let { token, pageToken } = req.query
        let response = await fetchListFromGoogleApi(token, pageToken)
        let status = response.status || 200
        return res.status(status).json(response)

    } catch(error) {
        l.error('Error occured in fetching contact list', {error})
        let messagge = error.messagge || 'Something went wrong'
        return res.status(500).json({ success: false, messagge })
    }
}


const deleteContact = async(req, res) => {
    let { resourceName, token  } = req.body
    try {
        let response = await deleteContactFromGoogle(token, resourceName)
        let status = response.status || 200
        return res.status(status).json(response)
    } catch(error) {}
        l.error('Error occured in deleting contact list', {error, resourceName})
        let messagge = error.messagge || 'Something went wrong'
        return res.status(500).json({ success: false, messagge })
}

module.exports = {
    fetchContactList,
    deleteContact,
}