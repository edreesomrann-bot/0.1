/**
 * Hirafi (حِرفي) Booking State Machine & Transition Rules
 * Deterministic logic for job workflow progression.
 */

export type JobStatus =
  | 'requested'
  | 'accepted'
  | 'en_route'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface StatusTransitionRule {
  allowedNext: JobStatus[];
  allowedRoles: ('customer' | 'craftsman' | 'system')[];
  descriptionAr: string;
  descriptionEn: string;
}

export const JOB_STATUS_RULES: Record<JobStatus, StatusTransitionRule> = {
  requested: {
    allowedNext: ['accepted', 'cancelled'],
    allowedRoles: ['craftsman', 'customer', 'system'],
    descriptionAr: 'تم إرسال الطلب وفي انتظار تأكيد الحرفي',
    descriptionEn: 'Request submitted, awaiting craftsman acceptance',
  },
  accepted: {
    allowedNext: ['en_route', 'cancelled'],
    allowedRoles: ['craftsman', 'customer'],
    descriptionAr: 'تم قبول الطلب وجدولة الموعد',
    descriptionEn: 'Request accepted, craftsman scheduled',
  },
  en_route: {
    allowedNext: ['arrived', 'cancelled'],
    allowedRoles: ['craftsman'],
    descriptionAr: 'الحرفي في الطريق إلى موقعك',
    descriptionEn: 'Craftsman is on the way to your location',
  },
  arrived: {
    allowedNext: ['in_progress'],
    allowedRoles: ['craftsman'],
    descriptionAr: 'وصل الحرفي إلى الموقع وجار المعاينة',
    descriptionEn: 'Craftsman arrived at location for inspection',
  },
  in_progress: {
    allowedNext: ['completed'],
    allowedRoles: ['craftsman'],
    descriptionAr: 'العمل جاري على إصلاح المشكلة',
    descriptionEn: 'Work is currently in progress',
  },
  completed: {
    allowedNext: [],
    allowedRoles: [],
    descriptionAr: 'تم إنجاز الخدمة بنجاح واستلام الدفع',
    descriptionEn: 'Job successfully completed and settled',
  },
  cancelled: {
    allowedNext: [],
    allowedRoles: [],
    descriptionAr: 'تم إلغاء الطلب',
    descriptionEn: 'Booking was cancelled',
  },
};

/**
 * Validates if a transition from current status to next status is legal for the given user role.
 */
export function canTransitionStatus(
  current: JobStatus,
  next: JobStatus,
  role: 'customer' | 'craftsman'
): { allowed: boolean; reason?: string } {
  if (current === next) {
    return { allowed: false, reason: 'Already in this status' };
  }

  const rule = JOB_STATUS_RULES[current];
  if (!rule) {
    return { allowed: false, reason: 'Invalid current status' };
  }

  if (!rule.allowedNext.includes(next)) {
    return {
      allowed: false,
      reason: `Cannot transition directly from ${current} to ${next}`,
    };
  }

  // Check role permission
  if (next === 'cancelled' && role === 'customer') {
    // Customers can cancel while requested or accepted, but not once en_route or in_progress
    if (current === 'requested' || current === 'accepted') {
      return { allowed: true };
    }
    return { allowed: false, reason: 'Cannot cancel after craftsman has dispatched' };
  }

  if (!rule.allowedRoles.includes(role)) {
    return {
      allowed: false,
      reason: `Role '${role}' is not authorized to transition ${current} to ${next}`,
    };
  }

  return { allowed: true };
}

/**
 * Calculates estimated minutes to arrival based on distance and average traffic speed.
 */
export function calculateEstimatedArrivalMinutes(distanceKm: number, averageSpeedKmH: number = 30): number {
  if (distanceKm <= 0) return 0;
  const hours = distanceKm / Math.max(10, averageSpeedKmH);
  const minutes = Math.round(hours * 60);
  // Add 3-5 min baseline parking/dispatch buffer
  return Math.max(5, minutes + 4);
}

/**
 * Formats ETA for display in Arabic or English
 */
export function formatETA(minutes: number, locale: 'ar' | 'en' = 'ar'): string {
  if (minutes <= 0) {
    return locale === 'ar' ? 'وصل الآن' : 'Arrived now';
  }
  if (minutes === 1) {
    return locale === 'ar' ? 'دقيقة واحدة' : '1 minute';
  }
  if (minutes === 2) {
    return locale === 'ar' ? 'دقيقتان' : '2 minutes';
  }
  if (locale === 'ar') {
    return `${minutes} دقيقة`;
  }
  return `${minutes} mins`;
}
