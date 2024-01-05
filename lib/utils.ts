import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {
  BASE_EPOCH_COUNT,
  BASE_EPOCH_COUNT_FEE,
  BASE_TICK_LENGTH_FEE,
  MAX_TICK_LENGTH,
  MIN_TICK_LENGTH
} from "./contants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculate_deploy_fee(tick: string, epoch_count: number): number {
  console.dir(tick)
  console.dir(epoch_count)
  let tick_len = tick.length
  if (tick_len < MIN_TICK_LENGTH && tick_len > MAX_TICK_LENGTH) {
    return -1
  }
  let tick_len_fee = BASE_TICK_LENGTH_FEE * MIN_TICK_LENGTH / tick_len;
  let epoch_fee = 0;
  if (epoch_count >= BASE_EPOCH_COUNT) {
    epoch_fee = BASE_EPOCH_COUNT_FEE
  } else {
    epoch_fee = BASE_EPOCH_COUNT * BASE_EPOCH_COUNT_FEE / epoch_count
  }

  return tick_len_fee + epoch_fee
}
