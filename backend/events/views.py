from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status

from .models import Event
from .serializers import EventSerializer


# ==========================================
# REGISTER
# ==========================================

@api_view(["POST"])
def register(request):

    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"error": "Username and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        password=password
    )

    return Response(
        {
            "message": "User created successfully",
            "username": user.username
        },
        status=status.HTTP_201_CREATED
    )


# ==========================================
# LOGIN
# ==========================================

@api_view(["POST"])
def login(request):

    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(
        username=username,
        password=password
    )

    if user is None:
        return Response(
            {"error": "Invalid username or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    token, created = Token.objects.get_or_create(
        user=user
    )

    return Response({
        "message": "Login successful",
        "user_id": user.id,
        "username": user.username,
        "token": token.key
    })


# ==========================================
# EVENTS
# ==========================================

@api_view(["GET", "POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def event_list(request):

    # --------------------------------------
    # GET CURRENT USER'S EVENTS
    # --------------------------------------

    if request.method == "GET":

        events = Event.objects.filter(
            owner=request.user
        )

        serializer = EventSerializer(
            events,
            many=True
        )

        return Response(serializer.data)


    # --------------------------------------
    # CREATE EVENT
    # --------------------------------------

    if request.method == "POST":

        serializer = EventSerializer(
            data=request.data
        )

        if serializer.is_valid():

            event = serializer.save(
                owner=request.user
            )

            return Response(
                EventSerializer(event).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# ==========================================
# SINGLE EVENT
# ==========================================

@api_view(["GET", "PUT", "PATCH", "DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def event_detail(request, pk):

    try:

        event = Event.objects.get(
            pk=pk,
            owner=request.user
        )

    except Event.DoesNotExist:

        return Response(
            {"error": "Event not found"},
            status=status.HTTP_404_NOT_FOUND
        )


    # GET

    if request.method == "GET":

        serializer = EventSerializer(event)

        return Response(
            serializer.data
        )


    # UPDATE

    if request.method in ["PUT", "PATCH"]:

        serializer = EventSerializer(
            event,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            updated_event = serializer.save()

            return Response(
                EventSerializer(updated_event).data
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


    # DELETE

    if request.method == "DELETE":

        event.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )