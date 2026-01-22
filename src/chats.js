const chats = [
    {
        "nick": "alice",
        "name": "Alice Johnson",
        "avatar": "https://picsum.photos/id/1005/80/80",
        "last_message_at": "2026-01-20T13:10:00-04:00",
        "messages": [
            {
                "id": "1",
                "text": "Hey Alice, how's the project going?",
                "sent_at": "2026-01-20T12:00:00-04:00",
                "is_read": true,
                "direction": "sent",
                "fromMe": true,
                "media": null
            },
            {
                "id": "2",
                "text": "I'm good! Just finished the UI mockup.",
                "sent_at": "2026-01-20T12:05:00-04:00",
                "is_read": true,
                "direction": "received",
                "fromMe": false,
                "media": null
            },
            {
                "id": "3",
                "text": "Great! Can you share a screenshot?",
                "sent_at": "2026-01-20T12:10:00-04:00",
                "is_read": true,
                "direction": "sent",
                "fromMe": true,
                "media": null
            },
            {
                "id": "4",
                "text": "Sure, here it",
                "sent_at": "2026-01-20T12:15:00-04:00",
                "is_read": true,
                "direction": "received",
                "fromMe": false,
                "media": "https://picsum.photos/id/1015/200/150"
            },
            {
                "id": "5",
                "text": "Looks solid. Let's add some animation.",
                "sent_at": "2026-01-20T12:20:00-04:00",
                "is_read": true,
                "direction": "sent",
                "fromMe": true,
                "media": null
            },
            {
                "id": "6",
                "text": "Got it, I'll work on CSS transitions.",
                "sent_at": "2026-01-20T12:25:00-04:00",
                "is_read": true,
                "direction": "received",
                "fromMe": false,
                "media": null
            },
            {
                "id": "7",
                "text": "Also, need a placeholder avatar.",
                "sent_at": "2026-01-20T12:30:00-04:00",
                "is_read": true,
                "direction": "sent",
                "fromMe": true,
                "media": null
            },
            {
                "id": "8",
                "text": "Here's one: ![avatar](https://picsum.photos/id/237/100/100)",
                "sent_at": "2026-01-20T12:35:00-04:00",
                "is_read": true,
                "direction": "received",
                "fromMe": false,
                "media": "https://picsum.photos/id/237/100/100"
            },
            {
                "id": "9",
                "text": "Perfect! Thanks.",
                "sent_at": "2026-01-20T12:40:00-04:00",
                "is_read": true,
                "direction": "sent",
                "fromMe": true,
                "media": null
            },
            {
                "id": "10",
                "text": "Any deadline?",
                "sent_at": "2026-01-20T12:45:00-04:00",
                "is_read": true,
                "direction": "received",
                "fromMe": false,
                "media": null
            },
            {
                "id": "11",
                "text": "We need it by Friday.",
                "sent_at": "2026-01-20T12:50:00-04:00",
                "is_read": true,
                "direction": "sent",
                "fromMe": true,
                "media": null
            },
            {
                "id": "12",
                "text": "Understood, I'll push updates daily.",
                "sent_at": "2026-01-20T12:55:00-04:00",
                "is_read": true,
                "direction": "received",
                "fromMe": false,
                "media": null
            },
            {
                "id": "13",
                "text": "Thanks!",
                "sent_at": "2026-01-20T13:00:00-04:00",
                "is_read": false,
                "direction": "sent",
                "fromMe": true,
                "media": null
            },
            {
                "id": "14",
                "text": "No problem.",
                "sent_at": "2026-01-20T13:05:00-04:00",
                "is_read": true,
                "direction": "received",
                "fromMe": false,
                "media": null
            },
            {
                "id": "15",
                "text": "Talk later.",
                "sent_at": "2026-01-20T13:10:00-04:00",
                "is_read": false,
                "direction": "sent",
                "fromMe": true,
                "media": null
            }
        ]
    },
    {
        "nick": "bob",
        "name": "Bob Smith",
        "avatar": "https://picsum.photos/id/1025/80/80",
        "last_message_at": "2026-01-20T14:30:00-04:00",
        "messages": [
            {
                "id": "1",
                "text": "Hey Bob, did you test the Electron build?",
                "sent_at": "2026-01-20T13:30:00-04:00",
                "is_read": true,
                "direction": "sent",
                "fromMe": true,
                "media": null
            },
            {
                "id": "2",
                "text": "Yes, it runs fine on Windows.",
                "sent_at": "2026-01-20T13:35:00-04:00",
                "is_read": true,
                "direction": "received",
                "fromMe": false,
                "media": null
            },
            {
                "id": "3",
                "text": "Great! Any performance hiccups?",
                "sent_at": "2026-01-20T13:40:00-04:00",
                "is_read": true,
                "direction": "sent",
                "fromMe": true,
                "media": null
            },
            {
                "id": "4",
                "text": "Not really, but the splash screen looks dull.",
                "sent_at": "2026-01-20T13:45:00-04:00",
                "is_read": true,
                "direction": "received",
                "fromMe": false,
                "media": null
            },
            {
                "id": "5",
                "text": "Check this design: ![splash](https://picsum.photos/id/1062/300/200)",
                "sent_at": "2026-01-20T13:50:00-04:00",
                "is_read": true,
                "direction": "sent",
                "fromMe": true,
                "media": "https://picsum.photos/id/1062/300/200"
            },
            {
                "id": "6",
                "text": "Looks modern, I'll integrate it.",
                "sent_at": "2026-01-20T13:55:00-04:00",
                "is_read": true,
                "direction": "received",
                "fromMe": false,
                "media": null
            },
            {
                "id": "7",
                "text": "Remember to update the package.json version.",
                "sent_at": "2026-01-20T14:00:00-04:00",
                "is_read": true,
                "direction": "sent",
                "fromMe": true,
                "media": null
            },
            {
                "id": "8",
                "text": "Done. Also added a dark mode toggle.",
                "sent_at": "2026-01-20T14:05:00-04:04:00",
                "is_read": true,
                "direction": "received",
                "fromMe": false,
                "media": null
            },
            {
                "id": "9",
                "text": "Awesome! Can you send a screenshot?",
                "sent_at": "2026-01-20T14:10:00-04:00",
                "is_read": true,
                "direction": "sent",
                "fromMe": true,
                "media": null
            },
            {
                "id": "10",
                "text": "Here it is: ![app](https://picsum.photos/id/1084/250/150)",
                "sent_at": "2026-01-20T14:15:00-04:00",
                "is_read": true,
                "direction": "received",
                "fromMe": false,
                "media": "https://picsum.photos/id/1084/250/150"
            },
            {
                "id": "11",
                "text": "Looks polished.",
                "sent_at": "2026-01-20T14:20:00-04:00",
                "is_read": true,
                "direction": "sent",
                "fromMe": true,
                "media": null
            },
            {
                "id": "12",
                "text": "Ready for the demo tomorrow.",
                "sent_at": "2026-01-20T14:25:00-04:00",
                "is_read": true,
                "direction": "received",
                "fromMe": false,
                "media": null
            },
            {
                "id": "13",
                "text": "I'll prepare the presentation.",
                "sent_at": "2026-01-20T14:27:00-04:00",
                "is_read": false,
                "direction": "sent",
                "fromMe": true,
                "media": null
            },
            {
                "id": "14",
                "text": "Great teamwork!",
                "sent_at": "2026-01-20T14:28:00-04:00",
                "is_read": true,
                "direction": "received",
                "fromMe": false,
                "media": null
            },
            {
                "id": "15",
                "text": "See you at 10am.",
                "sent_at": "2026-01-20T14:30:00-04:00",
                "is_read": false,
                "direction": "sent",
                "fromMe": true,
                "media": null
            }
        ]
    },
    {
        "nick": "charlie",
        "name": "Charlie Brown",
        "avatar": "https://picsum.photos/id/1035/80/80",
        "last_message_at": "2026-01-20T15:00:00-04:00",
        "messages": [
            {
                "id": "1",
                "text": "Hola Charlie, ¿cómo estás?",
                "sent_at": "2026-01-20T15:00:00-04:00",
                "is_read": true,
                "direction": "sent",
                "fromMe": true,
                "media": null
            },
            {
                "id": "2",
                "text": "Todo bien, gracias.",
                "sent_at": "2026-01-20T15:01:00-04:00",
                "is_read": true,
                "direction": "received",
                "fromMe": false,
                "media": null
            }
        ]
    },
    {
        "nick": "diana",
        "name": "Diana Prince",
        "avatar": "https://picsum.photos/id/1045/80/80",
        "last_message_at": "2026-01-20T15:10:00-04:00",
        "messages": [
            {
                "id": "1",
                "text": "Hey Diana!",
                "sent_at": "2026-01-20T15:10:00-04:00",
                "is_read": true,
                "direction": "sent",
                "fromMe": true,
                "media": null
            },
            {
                "id": "2",
                "text": "Hi! What's up?",
                "sent_at": "2026-01-20T15:11:00-04:00",
                "is_read": true,
                "direction": "received",
                "fromMe": false,
                "media": null
            }
        ]
    },
    {
        "nick": "evan",
        "name": "Evan Wright",
        "avatar": "https://picsum.photos/id/1055/80/80",
        "last_message_at": "2026-01-20T15:20:00-04:00",
        "messages": [
            {
                "id": "1",
                "text": "Evan, check this out.",
                "sent_at": "2026-01-20T15:20:00-04:00",
                "is_read": true,
                "direction": "sent",
                "fromMe": true,
                "media": null
            },
            {
                "id": "2",
                "text": "Looks great!",
                "sent_at": "2026-01-20T15:21:00-04:00",
                "is_read": true,
                "direction": "received",
                "fromMe": false,
                "media": null
            }
        ]
    },
    {
        "nick": "fiona",
        "name": "Fiona Gallagher",
        "avatar": "https://picsum.photos/id/1065/80/80",
        "last_message_at": "2026-01-20T15:30:00-04:00",
        "messages": [
            {
                "id": "1",
                "text": "Hey Fiona, need the report.",
                "sent_at": "2026-01-20T15:30:00-04:00",
                "is_read": true,
                "direction": "sent",
                "fromMe": true,
                "media": null
            },
            {
                "id": "2",
                "text": "On it!",
                "sent_at": "2026-01-20T15:31:00-04:00",
                "is_read": true,
                "direction": "received",
                "fromMe": false,
                "media": null
            }
        ]
    }
]

const contacts = chats.map(contact => ({
    nick: contact.nick,
    name: contact.name,
    avatar: contact.avatar,
    last_message_at: contact.last_message_at,
    last_message: contact.messages[contact.messages.length - 1]
}))

module.exports.contacts = contacts;
module.exports.chats = chats;