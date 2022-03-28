/**
 * Copyright 2021 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global chrome */

/**
* @fileoverview
*
* Diagnostics interface exposed to third-parties for running device diagnostics
* routines (tests).
*/

const ROUTINE_COMMAND_TYPE = {
  CANCEL: 'cancel',
  REMOVE: 'remove',
  RESUME: 'resume',
  GET_STATUS: 'status',
};

/**
 * Keeps track of Routine status when running dpsl.diagnostics.* diagnostics
 * routines.
 */
class Routine {
  /**
   * @param {!number} id
   */
  constructor(id) {
    /**
     * Routine ID created when the routine is first requested to run.
     * @type { !number }
     * @const
     */
    this.id = id;
  }

  /**
   * Sends |command| on this routine to the backend.
   * @param {!string} command
   * @return {!Promise<!dpsl.RoutineStatus>}
   * @private
   */
  async _getRoutineUpdate(command) {
    const request = {
      id: this.id,
      command: command,
    };

    return /** @type {!dpsl.RoutineStatus} */ (
      chrome.os.diagnostics.getRoutineUpdate(request));
  }

  /**
   * Returns current status of this routine.
   * @return { !Promise<!dpsl.RoutineStatus> }
   * @public
   */
  async getStatus() {
    return this._getRoutineUpdate(ROUTINE_COMMAND_TYPE.GET_STATUS);
  }

  /**
   * Resumes this routine, e.g. when user prompts to run a waiting routine.
   * @return { !Promise<!dpsl.RoutineStatus> }
   * @public
   */
  async resume() {
    return this._getRoutineUpdate(ROUTINE_COMMAND_TYPE.RESUME);
  }

  /**
   * Stops this routine, if running, or remove otherwise.
   * Note: The routine cannot be restarted again.
   * @return { !Promise<!dpsl.RoutineStatus> }
   * @public
   */
  async stop() {
    this._getRoutineUpdate(ROUTINE_COMMAND_TYPE.CANCEL);
    return this._getRoutineUpdate(ROUTINE_COMMAND_TYPE.REMOVE);
  }
}

/**
   * Returns true if a |functionName| exists in the chrome.os.diagnostics API.
   * Returns false otherwise.
   * @param {!string} functionName
   * @return { !boolean }
   */
function isSupported(functionName) {
  return chrome.os && chrome.os.diagnostics &&
      chrome.os.diagnostics[functionName] &&
      (typeof chrome.os.diagnostics[functionName] === 'function');
}

/**
   * Returns a meaningful error message if a |functionName| doesn't exist in
   * the chrome.os.diagnostics API.
   * @param {!string} functionName
   * @return { !string }
   */
function getErrorMessage(functionName) {
  return 'DPSL: chrome.os.diagnostics.' + functionName + '() is not found.' +
    ' Consider updating Google Chrome.';
}

/**
 * Diagnostics Battery Manager for dpsl.diagnostics.battery.* APIs.
 */
class BatteryManager {
  /**
   * Runs battery capacity test.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runCapacityRoutine() {
    const functionName = 'runBatteryCapacityRoutine';
    if (!isSupported(functionName)) {
      return Promise.reject(new Error(getErrorMessage(functionName)));
    }

    return chrome.os.diagnostics.runBatteryCapacityRoutine().then(
        (response) => new Routine(response.id));
  }

  /**
   * Runs battery health test.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runHealthRoutine() {
    const functionName = 'runBatteryHealthRoutine';
    if (!isSupported(functionName)) {
      return Promise.reject(new Error(getErrorMessage(functionName)));
    }

    return chrome.os.diagnostics.runBatteryHealthRoutine().then(
        (response) => new Routine(response.id));
  }

  /**
   * Runs battery capacity test.
   * @param {!dpsl.BatteryDischargeRoutineParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runDischargeRoutine(params) {
    const functionName = 'runBatteryDischargeRoutine';
    if (!isSupported(functionName)) {
      return Promise.reject(new Error(getErrorMessage(functionName)));
    }

    return chrome.os.diagnostics.runBatteryDischargeRoutine(params).then(
        (response) => new Routine(response.id));
  }

  /**
   * Runs battery charge test.
   * @param {!dpsl.BatteryChargeRoutineParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runChargeRoutine(params) {
    const functionName = 'runBatteryChargeRoutine';
    if (!isSupported(functionName)) {
      return Promise.reject(new Error(getErrorMessage(functionName)));
    }

    return chrome.os.diagnostics.runBatteryChargeRoutine(params).then(
        (response) => new Routine(response.id));
  }
}

/**
 * Diagnostics CPU Manager for dpsl.diagnostics.cpu.* APIs.
 */
class CpuManager {
  /**
   * Runs CPU cache test.
   * @param {!dpsl.CpuRoutineDurationParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runCacheRoutine(params) {
    const functionName = 'runCpuCacheRoutine';
    if (!isSupported(functionName)) {
      return Promise.reject(new Error(getErrorMessage(functionName)));
    }

    return chrome.os.diagnostics.runCpuCacheRoutine(params).then(
        (response) => new Routine(response.id));
  }

  /**
   * Runs CPU stress test.
   * @param {!dpsl.CpuRoutineDurationParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runStressRoutine(params) {
    const functionName = 'runCpuStressRoutine';
    if (!isSupported(functionName)) {
      return Promise.reject(new Error(getErrorMessage(functionName)));
    }

    return chrome.os.diagnostics.runCpuStressRoutine(params).then(
        (response) => new Routine(response.id));
  }

  /**
   * Runs CPU floating point accuracy test.
   * @param {!dpsl.CpuRoutineDurationParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runFloatingPointAccuracyRoutine(params) {
    const functionName = 'runCpuFloatingPointAccuracyRoutine';
    if (!isSupported(functionName)) {
      return Promise.reject(new Error(getErrorMessage(functionName)));
    }

    return chrome.os.diagnostics.runCpuFloatingPointAccuracyRoutine(params)
        .then((response) => new Routine(response.id));
  }

  /**
   * Runs CPU prime search test.
   * @param {!dpsl.CpuRoutineDurationParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runPrimeSearchRoutine(params) {
    const functionName = 'runCpuPrimeSearchRoutine';
    if (!isSupported(functionName)) {
      return Promise.reject(new Error(getErrorMessage(functionName)));
    }

    return chrome.os.diagnostics.runCpuPrimeSearchRoutine(params).then(
        (response) => new Routine(response.id));
  }
}

/**
 * Diagnostics Memory Manager for dpsl.diagnostics.memory.* APIs.
 */
class MemoryManager {
  /**
   * Runs memory test.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runMemoryRoutine() {
    const functionName = 'runMemoryRoutine';
    if (!isSupported(functionName)) {
      return Promise.reject(new Error(getErrorMessage(functionName)));
    }

    return chrome.os.diagnostics.runMemoryRoutine().then(
        (response) => new Routine(response.id));
  }
}

/**
 * Diagnostics Disk Manager for dpsl.diagnostics.disk.* APIs.
 */
class DiskManager {
  /**
   * Runs disk read test.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runReadRoutine() {
    const functionName = 'runDiskReadRoutine';
    if (!isSupported(functionName)) {
      return Promise.reject(new Error(getErrorMessage(functionName)));
    }

    return chrome.os.diagnostics.runDiskReadRoutine().then(
        (response) => new Routine(response.id));
  }
}

/**
 * Diagnostics NVMe Manager for dpsl.diagnostics.nmve.* APIs.
 */
class NvmeManager {
  /**
   * Runs NVMe smartctl test.
   * @return { !Promise<!Routine> }
   * @public
   */
  async runSmartctlCheckRoutine() {
    const functionName = 'runSmartctlCheckRoutine';
    if (!isSupported(functionName)) {
      return Promise.reject(new Error(getErrorMessage(functionName)));
    }

    return chrome.os.diagnostics.runSmartctlCheckRoutine().then(
        (response) => new Routine(response.id));
  }

  /**
   * Runs NVMe wear level test.
   * @param {!dpsl.NvmeWearLevelRoutineParams} params
   * @return { !Promise<!Routine> }
   * @public
   */
  async runWearLevelRoutine(params) {
    const functionName = 'runNvmeWearLevelRoutine';
    if (!isSupported(functionName)) {
      return Promise.reject(new Error(getErrorMessage(functionName)));
    }

    return chrome.os.diagnostics.runNvmeWearLevelRoutine(params).then(
        (response) => new Routine(response.id));
  }
}

/**
 * DPSL Diagnostics Manager for dpsl.diagnostics.* APIs.
 */
class DPSLDiagnosticsManager {
  /**
   * @constructor
   */
  constructor() {
    /**
     * @type {!BatteryManager}
     * @public
     */
    this.battery = new BatteryManager();

    /**
     * @type {!CpuManager}
     * @public
     */
    this.cpu = new CpuManager();

    /**
     * @type {!MemoryManager}
     * @public
     */
    this.memory = new MemoryManager();

    /**
     * @type {!DiskManager}
     * @public
     */
    this.disk = new DiskManager();

    /**
     * @type {!NvmeManager}
     * @public
     */
    this.nvme = new NvmeManager();
  }

  /**
     * Requests a list of available diagnostics routines.
     * @return { !Promise<!dpsl.AvailableRoutinesList> }
     * @public
     */
  async getAvailableRoutines() {
    const functionName = 'getAvailableRoutines';
    if (!isSupported(functionName)) {
      return Promise.reject(new Error(getErrorMessage(functionName)));
    }

    return chrome.os.diagnostics.getAvailableRoutines();
  }
}

module.exports = {
  DPSLDiagnosticsManager: DPSLDiagnosticsManager,
  Routine: Routine,
};
