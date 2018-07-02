const http = require('../modules/http');
const util = require('../modules/util');

module.exports = {
  about: 'Work with project and application resources.',
  firstArg: 'project',
  operations: {
    // CRUD projects
    createProject: {
      execute: async ([, json]) => {
        const payload = await util.getPayload('ProjectDocument', json);
        return http.post('/projects', payload);
      },
      pattern: 'project create $payload',
    },
    listProject: {
      execute: async () => http.get('/projects'),
      pattern: 'project list',
    },
    readProject: {
      execute: async ([projectId]) => http.get(`/projects/${projectId}`),
      pattern: 'project $id read',
    },
    updateProject: {
      execute: async ([projectId, , json]) => http.put(`/projects/${projectId}`, JSON.parse(json)),
      pattern: 'project $id update $payload',
    },
    deleteProject: {
      execute: async ([projectId]) => http.delete(`/projects/${projectId}`),
      pattern: 'project $id delete',
    },

    // CRUD applications
    createApplication: {
      execute: async ([projectId, , , json]) => {
        const payload = await util.getPayload('ApplicationDocument', json);
        return http.post(`/projects/${projectId}/applications`, payload);
      },
      pattern: 'project $id application create $payload',
    },
    listApplication: {
      execute: async ([projectId]) => http.get(`/projects/${projectId}/applications`),
      pattern: 'project $id application list',
    },
    readApplication: {
      execute: async ([projectId, , applicationId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}`;
        return http.get(url);
      },
      pattern: 'project $id application $id read',
    },
    updateApplication: {
      execute: async ([projectId, , applicationId, , json]) => {
        const url = `/projects/${projectId}/applications/${applicationId}`;
        return http.put(url, JSON.parse(json));
      },
      pattern: 'project $id application $id update $payload',
    },
    deleteApplication: {
      execute: async ([projectId, , applicationId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}`;
        return http.delete(url);
      },
      pattern: 'project $id application $id delete',
    },

    // Trusted API Key
    readApplicationTrustedKey: {
      execute: async ([projectId, , applicationId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/secretKey`;
        return http.get(url);
      },
      pattern: 'project $id application $id secret-key read',
    },

    // Application Redirector
    readApplicationRedirector: {
      execute: async ([projectId, , applicationId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/redirector`;
        return http.get(url);
      },
      pattern: 'project $id application $id redirector read',
    },
    updateApplicationRedirector: {
      execute: async ([projectId, , applicationId, , , json]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/redirector`;
        return http.put(url, JSON.parse(json));
      },
      pattern: 'project $id application $id redirector update $payload',
    },

    // Reactor script
    readReactorScript: {
      execute: async ([projectId, , applicationId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/reactor/script`;
        return http.get(url);
      },
      pattern: 'project $id application $id reactor script read',
    },
    updateReactorScript: {
      execute: async ([projectId, , applicationId, , , , json]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/reactor/script`;
        return http.put(url, JSON.parse(json));
      },
      pattern: 'project $id application $id reactor script update $payload',
    },
    readReactorScriptStatus: {
      execute: async ([projectId, , applicationId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/reactor/script/status`;
        return http.get(url);
      },
      pattern: 'project $id application $id reactor script status read',
    },

    // Reactor logs
    readReactorLogs: {
      execute: async ([projectId, , applicationId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/reactor/logs`;
        return http.get(url);
      },
      pattern: 'project $id application $id reactor logs read',
    },
    deleteReactorLogs: {
      execute: async ([projectId, , applicationId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/reactor/logs`;
        return http.delete(url);
      },
      pattern: 'project $id application $id reactor logs delete',
    },

    // Reactor schedules
    createReactorSchedule: {
      execute: async ([projectId, , applicationId, , , , json]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/reactor/schedules`;
        return http.post(url, JSON.parse(json));
      },
      pattern: 'project $id application $id reactor schedule create $payload',
    },
    listReactorSchedules: {
      execute: async ([projectId, , applicationId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/reactor/schedules`;
        return http.get(url);
      },
      pattern: 'project $id application $id reactor schedule list',
    },
    readReactorSchedule: {
      execute: async ([projectId, , applicationId, , , scheduleId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/reactor/schedules/${scheduleId}`;
        return http.get(url);
      },
      pattern: 'project $id application $id reactor schedule $id read',
    },
    updateReactorSchedule: {
      execute: async ([projectId, , applicationId, , , scheduleId, , json]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/reactor/schedules/${scheduleId}`;
        return http.put(url, JSON.parse(json));
      },
      pattern: 'project $id application $id reactor schedule $id update $payload',
    },
    deleteReactorSchedule: {
      execute: async ([projectId, , applicationId, , , scheduleId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/reactor/schedules/${scheduleId}`;
        return http.delete(url);
      },
      pattern: 'project $id application $id reactor schedule $id delete',
    },
  },
};
