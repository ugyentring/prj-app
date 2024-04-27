export const POSTS = [
  {
    _id: "1",
    text: "Let's build a fullstack WhatsApp clone with NEXT.JS 14 😍",
    img: "/posts/dragon.jpg",
    user: {
      username: "johndoe",
      profileImage: "/avatars/boy1.png",
      fullName: "John Doe",
    },
    comments: [
      {
        _id: "1",
        text: "Nice Tutorial",
        user: {
          username: "janedoe",
          profileImage: "/avatars/girl1.png",
          fullName: "Jane Doe",
        },
      },
    ],
    likes: ["6658s891", "6658s892", "6658s893", "6658s894"],
  },
  {
    _id: "2",
    text: "How you guys doing? 😊",
    user: {
      username: "johndoe",
      profileImage: "/avatars/boy2.png",
      fullName: "John Doe",
    },
    comments: [
      {
        _id: "1",
        text: "Nice Tutorial",
        user: {
          username: "janedoe",
          profileImage: "/avatars/girl2.png",
          fullName: "Jane Doe",
        },
      },
    ],
    likes: ["6658s891", "6658s892", "6658s893", "6658s894"],
  },
  {
    _id: "3",
    text: "Astronaut in a room of drawers, generated by Midjourney. 🚀",
    img: "/posts/flag.png",
    user: {
      username: "johndoe",
      profileImage: "/avatars/boy3.png",
      fullName: "John Doe",
    },
    comments: [],
    likes: [
      "6658s891",
      "6658s892",
      "6658s893",
      "6658s894",
      "6658s895",
      "6658s896",
    ],
  },
  {
    _id: "4",
    text: "I'm learning GO this week. Any tips? 🤔",
    img: "/posts/kira.jpg",
    user: {
      username: "johndoe",
      profileImage: "/avatars/boy3.png",
      fullName: "John Doe",
    },
    comments: [
      {
        _id: "1",
        text: "Nice Tutorial",
        user: {
          username: "janedoe",
          profileImage: "/avatars/girl3.png",
          fullName: "Jane Doe",
        },
      },
    ],
    likes: [
      "6658s891",
      "6658s892",
      "6658s893",
      "6658s894",
      "6658s895",
      "6658s896",
      "6658s897",
      "6658s898",
      "6658s899",
    ],
  },
];

export const USERS_FOR_RIGHT_PANEL = [
  {
    _id: "1",
    fullName: "John Doe",
    username: "johndoe",
    profileImage: "/avatars/boy2.png",
  },
  {
    _id: "2",
    fullName: "Jane Doe",
    username: "janedoe",
    profileImage: "/avatars/girl1.png",
  },
  {
    _id: "3",
    fullName: "Bob Doe",
    username: "bobdoe",
    profileImage: "/avatars/boy3.png",
  },
  {
    _id: "4",
    fullName: "Daisy Doe",
    username: "daisydoe",
    profileImage: "/avatars/girl2.png",
  },
];
