/**
 * ChatApp - Renderer Process Logic
 * Maneja la lógica de la interfaz de usuario del chat
 */

const { ipcRenderer } = require('electron');

// ============================================================================
// VARIABLES GLOBALES
// ============================================================================

let contactSelected = null;
let contacts = null;

// ============================================================================
// CONSTANTES
// ============================================================================

const MESSAGE_STATUS_ICONS = {
    READ: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-blue-500 inline-block"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M1.5 12.75l6 6 9-13.5" transform="translate(3, 0)" /></svg>',
    SENT: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-gray-700 inline-block"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>'
};

// ============================================================================
// FUNCIONES DE MENSAJES
// ============================================================================

/**
 * Obtiene el icono de estado del mensaje
 * @param {Object} message - Objeto del mensaje
 * @returns {string} HTML del icono SVG
 */
function getMessageStatusIcon(message) {
    if (!message.fromMe) return '';
    return message.is_read ? MESSAGE_STATUS_ICONS.READ : MESSAGE_STATUS_ICONS.SENT;
}

/**
 * Construye el contenido del cuerpo del mensaje
 * @param {Object} message - Objeto del mensaje
 * @returns {string} HTML del cuerpo del mensaje
 */
function buildMessageBody(message) {
    const { media, text } = message;

    // Solo imagen
    if (media && !text) {
        return `<img src="${media}" alt="Imagen" class="w-full">`;
    }

    // Imagen con texto
    if (media && text) {
        return buildMediaWithText(media, text);
    }

    // Solo texto
    return `<span class="text-white drop-shadow-sm">${text || ''}</span>`;
}

/**
 * Construye el HTML para mensajes con imagen y texto
 * @param {string} media - URL de la imagen
 * @param {string} text - Texto del mensaje
 * @returns {string} HTML combinado
 */
function buildMediaWithText(media, text) {
    const imageTag = `<img src="${media}" alt="${text}" class="w-full">`;

    // Si el texto contiene una URL
    if (text.includes('http')) {
        const urlPosition = text.indexOf('http');
        const textBeforeUrl = text.substring(0, urlPosition);
        const url = text.substring(urlPosition);

        return `${imageTag}<span class="text-white drop-shadow-sm">${textBeforeUrl}</span><a class="text-blue-500 hover:underline" href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    }

    // Texto normal con imagen
    return `${imageTag}<span class="text-white drop-shadow-sm">${text}</span>`;
}

/**
 * Formatea la hora del mensaje
 * @param {string} timestamp - Timestamp del mensaje
 * @returns {string} Hora formateada
 */
function formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Crea el HTML de un mensaje individual
 * @param {Object} message - Objeto del mensaje
 * @returns {string} HTML del mensaje
 */
function createMessageHTML(message) {
    const classBurble = message.fromMe ? 'burble-sent' : 'burble-received';
    const timeColorClass = message.fromMe ? 'text-gray-300' : 'text-emerald-600';
    const statusIcon = getMessageStatusIcon(message);
    const bodyMessage = buildMessageBody(message);
    const formattedTime = formatMessageTime(message.sent_at);

    return `<li data-from-me="${message.fromMe}" class="rounded-2xl w-90 md:max-w-65 ${classBurble} text-white rounded-lg px-3 py-2 flex flex-col gap-1">
        ${bodyMessage}
        <div class="flex justify-end gap-1">
            <small class="text-[0.65rem] ${timeColorClass}">${formattedTime}</small>
            ${statusIcon}
        </div>
    </li>`;
}

/**
 * Renderiza la lista de mensajes en el DOM
 * @param {Array} data - Array de mensajes
 */
function renderMessages(data) {
    if (!Array.isArray(data) || data.length === 0) {
        document.getElementById('messages').innerHTML = '';
        return;
    }

    const messagesHTML = data.map(message => createMessageHTML(message)).join('');
    document.getElementById('messages').innerHTML = messagesHTML;
}

// ============================================================================
// FUNCIONES DE CONTACTOS
// ============================================================================

/**
 * Obtiene el preview del último mensaje del contacto
 * @param {Object} lastMessage - Último mensaje del contacto
 * @returns {string} Texto del preview
 */
function getMessagePreview(lastMessage) {
    if (!lastMessage || !lastMessage.text) return '';

    // Si el mensaje contiene una URL, mostrar "imagen" o "enlace"
    if (lastMessage.text.includes('http')) {
        return lastMessage.media ? 'Imagen' : 'Enlace';
    }

    // Limitar longitud del preview
    const maxLength = 30;
    return lastMessage.text.length > maxLength
        ? lastMessage.text.substring(0, maxLength) + '...'
        : lastMessage.text;
}

/**
 * Calcula el tiempo relativo desde el último mensaje
 * @param {string} timestamp - Timestamp del último mensaje
 * @returns {string} Tiempo relativo formateado
 */
function getRelativeTime(timestamp) {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMs = now - messageTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays}d`;

    return messageTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
}

/**
 * Crea el HTML de un contacto individual
 * @param {Object} contact - Objeto del contacto
 * @returns {string} HTML del contacto
 */
function createContactHTML(contact) {
    const messagePreview = getMessagePreview(contact.last_message);
    const relativeTime = getRelativeTime(contact.last_message_at);

    return `<li class="rounded-lg px-3 cursor-pointer hover:bg-gray-800 transition-colors" data-contact-nick="${contact.nick}">
        <div class="flex items-center justify-between gap-3 text-white">
            <div class="relative">
                <img class="h-8 max-w-8 rounded-full object-cover"
                    src="${contact.avatar}"
                    alt="${contact.name}"
                    loading="lazy">
                <span class="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
            </div>
            <h3 class="flex-1 text-sm hidden sm:block truncate">${contact.name}</h3>
            <small class="text-gray-400 text-xs hidden lg:block">${relativeTime}</small>
        </div>
        <div class="px-11 hidden lg:block">
            <p class="text-xs text-gray-400 truncate">${messagePreview}</p>
        </div>
    </li>`;
}

/**
 * Maneja el click en un contacto usando delegación de eventos
 * @param {Event} event - Evento de click
 */
function handleContactClick(event) {
    const contactItem = event.target.closest('li[data-contact-nick]');
    if (!contactItem) return;

    const nick = contactItem.dataset.contactNick;
    selectContact(contactItem, nick);
}

/**
 * Renderiza la lista de contactos en el DOM
 * @param {Array} data - Array de contactos
 */
function renderContacts(data) {
    // Validación de datos
    if (!Array.isArray(data)) {
        console.error('renderContacts: data debe ser un array');
        return;
    }

    // Guardar referencia global de contactos
    contacts = data;

    // Si no hay contactos, limpiar y mostrar estado vacío
    if (data.length === 0) {
        document.querySelector('#contactList').innerHTML = '';
        clearChatZone();
        return;
    }

    // Generar HTML de contactos
    const contactsHTML = data.map(contact => createContactHTML(contact)).join('');

    // Actualizar DOM
    const contactList = document.querySelector('#contactList');
    contactList.innerHTML = contactsHTML;

    // Agregar event listener usando delegación de eventos (solo una vez)
    if (!contactList.dataset.listenerAttached) {
        contactList.addEventListener('click', handleContactClick);
        contactList.dataset.listenerAttached = 'true';
    }

    // Si no hay contacto seleccionado, limpiar zona de chat
    if (!contactSelected) {
        clearChatZone();
    }
}

// ============================================================================
// FUNCIONES DE NAVEGACIÓN Y UI
// ============================================================================

/**
 * Selecciona un contacto y muestra su chat
 * @param {HTMLElement} el - Elemento del contacto clickeado
 * @param {string} nick - Nick del contacto
 */
const selectContact = (el, nick) => {
    contactSelected = nick;
    const contact = contacts.find(contact => contact.nick === nick);

    // Actualizar header del chat
    document.querySelector('#contactName').innerHTML = contact.name;
    document.querySelector('#contactStatus').innerHTML = contact.status || '';
    document.querySelector('#contactAvatar').src = contact.avatar;
    document.querySelector('#contactAvatar').classList.remove('hidden');

    // Mostrar footer y limpiar mensajes
    document.querySelector('#chatFooter').classList.remove('hidden');
    document.querySelector('#messages').innerHTML = "";
    document.querySelector('#noChatSelected').classList.add('hidden');

    // Actualizar selección visual
    document.querySelectorAll('#contactList li').forEach(contact => {
        contact.classList.remove('contact-selected');
    });
    el.classList.add('contact-selected');

    // Solicitar mensajes al proceso principal
    ipcRenderer.send('contact-selected', nick);
}

/**
 * Limpia la zona de chat y resetea el estado
 */
const clearChatZone = () => {
    document.querySelector('#contactName').innerHTML = "";
    document.querySelector('#contactStatus').innerHTML = "";
    document.querySelector('#contactAvatar').src = "";
    document.querySelector('#contactAvatar').classList.add('hidden');
    document.querySelector('#chatFooter').classList.add('hidden');
    document.querySelector('#messages').innerHTML = "";
    document.querySelector('#noChatSelected').classList.toggle('hidden');

    document.querySelectorAll('#contactList li').forEach(contact => {
        contact.classList.remove('contact-selected');
    });
}

// ============================================================================
// IPC LISTENERS
// ============================================================================

ipcRenderer.on('contacts', (event, data) => {
    renderContacts(data);
});

ipcRenderer.on('user-messages', (event, data) => {
    renderMessages(data);
});

ipcRenderer.on('update-available', (event, data) => {
    console.log('Update available', data);
});

ipcRenderer.on('update-downloading', (event, data) => {
    console.log('Update downloading', data);
});

ipcRenderer.on('update-ready', (event, data) => {
    console.log('Update ready', data);
});

// ============================================================================
// EVENT LISTENERS
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
    clearChatZone();
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        clearChatZone();
    }
});
