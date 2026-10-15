from fastapi import APIRouter

from controllers.user.create_user import create_user
from controllers.user.get_all_users import get_all_users
from controllers.user.user_signin import user_signin

USER_ROUTER = APIRouter(prefix="/user",tags=["User API"])

USER_ROUTER.add_api_route("/signup", create_user, methods=["POST"])
USER_ROUTER.add_api_route("/signin", user_signin, methods=["POST"])
USER_ROUTER.add_api_route("/all", get_all_users, methods=["GET"])