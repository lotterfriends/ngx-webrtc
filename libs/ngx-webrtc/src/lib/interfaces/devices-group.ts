import { DeviceType } from '../enums';

export interface DevicesGroup {
  kind: DeviceType,
  devices: MediaDeviceInfo[]
}