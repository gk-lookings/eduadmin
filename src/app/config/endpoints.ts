// const HOST                          = 'https://obscure-springs-41892.herokuapp.com/api/'
const HOST                          = 'https://api.classteam.io/api/'
const LOGIN                         = HOST + 'auth/login'

const USER_DETAILS                  = HOST + 'user'
const USERS_LIST                    = HOST + 'user/search'
const USER_DEACTIVATE               = HOST + 'user/deactivate'
const USER_ACTIVATE                 = HOST + 'user/activateUser'
const ACTIVITY                      = HOST + 'activity'


const CLASSROOM_LIST                = HOST + 'class-room/search'
const CLASSROOM                     = HOST + 'class-room/'
const VERIFY_CLASSROOM              = HOST + "class-room/check"

const EVENTS                        = HOST + 'event'

const SUBJECT                       = HOST + 'subject'

const TEMPLATE_COMPLETE_LIST        = HOST + 'template/list'
const TEMPLATE_LIST                 = HOST + 'template/search'
const TEMPLATE_CREATE               = HOST + 'template'
const GET_TEMPLATE                  = HOST + 'template/'

const DASHBOARD                     = HOST + 'misc/global-stats'

const FILTER                        = HOST + 'filter'
const FILTER_SUGGET                 = HOST + '​filter​/suggest'


const CREATE_POST                   = HOST + 'post/admin-post'


export {
    HOST,
    LOGIN,
    EVENTS,
    TEMPLATE_COMPLETE_LIST,
    TEMPLATE_LIST,
    TEMPLATE_CREATE,
    GET_TEMPLATE,
    SUBJECT,
    USERS_LIST,
    CLASSROOM_LIST,
    CLASSROOM,
    DASHBOARD,
    ACTIVITY,
    USER_DETAILS,
    FILTER,
    USER_DEACTIVATE,
    USER_ACTIVATE,
    CREATE_POST,
    FILTER_SUGGET,
}