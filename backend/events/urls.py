from django.urls import path

from .views import (
    register,
    login,
    event_list,
    event_detail,
)


urlpatterns = [

    # Authentication
    path("register/", register),
    path("login/", login),

    # Events
    path("events/", event_list),
    path("events/<int:pk>/", event_detail),

]