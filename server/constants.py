from enum import Enum

class Constant(Enum):
    STUDENT = "Student"
    TEACHER = "Teacher"

    IS_TEACHING_STAFF = "Teaching Staff"
    IS_STUDENT = True

    INCORRECT_OTP = "Incorrect OTP"
    CORRECT_OTP = "Correct OTP"
    EXPIRED_OTP = "Expired OTP"
    OTP_SENT = "OTP Sent"

    VERIFY_EMAIL = "Verify Email"

    VERIFY_EMAIL_OTP = "Verify Email OTP"
    VERIFY_LOGIN_OTP = "Verify Login OTP"

    USER_EXIST = "User Exist"
    USER_DOES_NOT_EXIST = "User does not exist"
    USER_NOT_VERIFIED = "User not verified"
    USER_LOGGEDIN = "User loggedin"

    WILL_BE_NOTIFIED = "Will be notified"

    ASSIGNMENT_CREATED = "Assignment Created"
    GOT_ASSIGNMENT = "Got Assignment"
    ALL_SUBMISSIONS = "All Submissions"


