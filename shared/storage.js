(function (global) {
    'use strict';

    const NS = 'tboxes';
    const DEVICE_KEY = NS + ':deviceId';

    function uuid() {
        if (global.crypto && typeof global.crypto.randomUUID === 'function') {
            return global.crypto.randomUUID();
        }
        const bytes = new Uint8Array(16);
        if (global.crypto && global.crypto.getRandomValues) {
            global.crypto.getRandomValues(bytes);
        } else {
            for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
        }
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0'));
        return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
    }

    function getDeviceId() {
        let id = localStorage.getItem(DEVICE_KEY);
        if (!id) {
            id = uuid();
            localStorage.setItem(DEVICE_KEY, id);
        }
        return id;
    }

    function key(name) {
        return `${NS}:${getDeviceId()}:${name}`;
    }

    function readJSON(name, fallback) {
        try {
            const raw = localStorage.getItem(key(name));
            if (raw === null) return fallback;
            return JSON.parse(raw);
        } catch (e) {
            console.warn('storage.readJSON failed for', name, e);
            return fallback;
        }
    }

    function writeJSON(name, value) {
        try {
            localStorage.setItem(key(name), JSON.stringify(value));
        } catch (e) {
            console.error('storage.writeJSON failed for', name, e);
        }
    }

    function remove(name) {
        localStorage.removeItem(key(name));
    }

    const Storage = {
        getDeviceId,
        get: readJSON,
        set: writeJSON,
        remove,

        getCurrentSession() {
            return readJSON('currentSession', null);
        },
        setCurrentSession(payload) {
            writeJSON('currentSession', payload);
        },
        clearCurrentSession() {
            remove('currentSession');
        },

        getLastResult() {
            return readJSON('lastResult', null);
        },
        setLastResult(payload) {
            writeJSON('lastResult', payload);
        },

        getHistory() {
            const list = readJSON('history', []);
            return Array.isArray(list) ? list : [];
        },
        appendHistory(entry) {
            const list = this.getHistory();
            list.push(entry);
            writeJSON('history', list);
        },

        getStats() {
            return readJSON('stats', null);
        },
        setStats(stats) {
            writeJSON('stats', stats);
        }
    };

    global.TBoxesStorage = Storage;
})(window);
