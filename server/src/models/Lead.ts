import { Schema, model } from 'mongoose';
import { LeadSource, LeadStatus } from '@crm/shared';

/** Mongoose subdocument shape for a timeline note. */
interface INote {
  type: 'note' | 'status_change';
  content: string;
  author: string;
  timestamp: Date;
}

/** Mongoose document shape for a CRM lead. */
interface ILead {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source: (typeof LeadSource)[number];
  status: (typeof LeadStatus)[number];
  notes: INote[];
}

const noteSchema = new Schema<INote>(
  {
    type: {
      type: String,
      enum: ['note', 'status_change'],
      required: true,
    },
    content: { type: String, required: true },
    author: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    message: { type: String },
    source: { type: String, enum: LeadSource, required: true },
    status: { type: String, enum: LeadStatus, default: 'new' },
    notes: { type: [noteSchema], default: [] },
  },
  { timestamps: true },
);

leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });

export const Lead = model<ILead>('Lead', leadSchema);
