const HOST                          = 'https://obscure-springs-41892.herokuapp.com/api/'
const LOGIN                         = HOST + 'auth/login'

const USER_DETAILS                  = HOST + 'user'
const USERS_LIST                    = HOST + 'user/list'
const USER_DEACTIVATE               = HOST + 'user/deactivate'

const ACTIVITY                      = HOST + 'activity'


const CLASSROOM_LIST                = HOST + 'class-room/list'
const CLASSROOM                     = HOST + 'class-room/'
const VERIFY_CLASSROOM              = HOST + "class-room/check"

const EVENTS                        = HOST + 'event'

const SUBJECT                       = HOST + 'subject'

const TEMPLATE_LIST                 = HOST + 'template/list'
const TEMPLATE_CREATE               = HOST + 'template'
const GET_TEMPLATE                  = HOST + 'template/'

const DASHBOARD                     = HOST + 'misc/global-stats'

const FILTER                        = HOST + 'filter'


export {
    HOST,
    LOGIN,
    EVENTS,
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
    USER_DEACTIVATE

}