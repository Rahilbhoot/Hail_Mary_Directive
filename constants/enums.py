from enum import Enum


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    MC = "MC"
    ASS = "ASS"
