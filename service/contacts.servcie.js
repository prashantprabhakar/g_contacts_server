
const { handleRequest } = require('./http.service')
const { CONTACTS_API } = require('../config/constants')
const l = require('./logger.service') 

/**
 * @dev Pagetoken can be used to fetch recods with pagination
 * Paginiation is currently not implemeted and max record we can get is 1000.
 */
exports.fetchListFromGoogleApi = async(token, pageToken, personFields='names,emailAddresses,phoneNumbers,photos') => {
    try {
        l.info('Trying to get contact list')
        let response = await handleRequest({
            method: 'GET',
            url: CONTACTS_API.LIST,
            data: {
                personFields,
                pageToken,
                pageSize: 1000,
            },
            config: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        })
        l.info('list contact response from google', {data: response.data, staus: response.status })

        if(response.status === 200) {
            let data = formatContactListResponse(response.data.connections)
            return {
                success: true,
                data : {
                    contactList: data,
                    totalItems: response.data.totalItems,
                    nextPageToken: response.data.nextPageToken,
                },
                
            }
        } else {
            let message = response.data || _getMessageFromResponse(response.status)
            return {
                success: false, 
                status: response.status || 500,
                message
            }

        }



    } catch(error) {
        throw error
    }
}

exports.deleteContactFromGoogle = async(token, resourceName) => {
    try {
        let url = CONTACTS_API.DELETE_CONTACT.replace('RESOURCE_NAME', resourceName)
        l.info(`Deleting contact`, {
            url,
            resourceName
        })
        let response = await handleRequest({
            method: 'DELETE',
            url,
            config: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        })

        l.info(`Response from delete contact api google`, { response})
        if(response.status === 401) return { status: 401, success: false, message: 'Unauthorized'}
        if(response.status === 200) return {success: true, data : {}}
        else return { status: 500, success: false, message: 'Something went wrong'}
    } catch(err) {
         throw err
    }
}


/**
 * @dev Although there can be multiple contacts associated with same user
 * We are just using first one for simplicity reasons
 */
const formatContactListResponse = (connections) => {
    return connections.map( connection => ({
        name: connection.names ? connection.names[0].displayName: undefined,
        phoneNumber: connection.phoneNumbers ? connection.phoneNumbers[0].value: undefined,
        email: connection.emailAddresses ?  connection.emailAddresses[0].value : undefined,
        photo: connection.photos ? connection.photos[0].url: undefined,
        metaData: {
            etag: connection.etag,
            resourceName: connection.resourceName

        },

    }))
}


/**
 * 
 * @dev this should be moved to a common util fn
 */
const _getMessageFromResponse = status => {
    switch(status){
        case 400: return 'Bad Request'
        case 401: return 'You are not allowed to access the resource'
        case 401: return 'You do not have sufficient permission to access the resource'
        case 500: return 'Server error. Please report the issuse'
        case 200: return 'Successful'
        default: return 'Something wrong happened. Please report the issuse'
    }
}