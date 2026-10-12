from enum import Enum


class UserRole(str, Enum):
    ADMIN = "admin"
    MC = "mc"
    ASS = "ass"
