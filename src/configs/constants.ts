const PAGES = 1
const LIMIT = 0
const DEFAULT_PAGE_SIZE = 20
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 200, 500]

const GRAPH_OPTIONS = {
  scales: {
    yAxes: {
      min: 0,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
}

enum EXPORT_TYPE {
  JSON = 'json',
  EXCEL = 'xlsx',
}

const DATASET_FILTER_FIELD = {
  TEXT: 'text',
  ACTION: 'action',
}

const DATASET_FILTER_OPTION = {
  CONTAIN: '%',
  EQUAL: '=',
  NOT_EQUAL: '!=',
}

const ErrorCode = {
  INACTIVE_CHANNEL: 'INACTIVE_CHANNEL',
  FORBIDDEN: 'FORBIDDEN',
  UNAUTHORIZED: 'UNAUTHORIZED',
  DOWNLOADFAIL: 'DOWNLOAD_FAIL',
}

const DatasetFilterFieldTagSelect = [
  {
    name: 'Text',
    value: DATASET_FILTER_FIELD.TEXT,
  },
  {
    name: 'Definition',
    value: DATASET_FILTER_FIELD.ACTION,
  },
]

const DatasetFilterOptionTagSelect = [
  {
    name: 'Contain',
    value: DATASET_FILTER_OPTION.CONTAIN,
  },
  {
    name: 'Equal',
    value: DATASET_FILTER_OPTION.EQUAL,
  },
  {
    name: 'Not Equal',
    value: DATASET_FILTER_OPTION.NOT_EQUAL,
  },
]

const DatasetFilterFieldDisabledOption = {
  [DATASET_FILTER_FIELD.TEXT]: DATASET_FILTER_OPTION.NOT_EQUAL,
}

const DataSetFilterOperationMap = {
  [DATASET_FILTER_OPTION.CONTAIN]: 'like',
  [DATASET_FILTER_OPTION.EQUAL]: 'eq',
  [DATASET_FILTER_OPTION.NOT_EQUAL]: 'neq',
}

export {
  PAGES,
  LIMIT,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  GRAPH_OPTIONS,
  EXPORT_TYPE,
  DATASET_FILTER_FIELD,
  DATASET_FILTER_OPTION,
  ErrorCode,
  DatasetFilterFieldTagSelect,
  DatasetFilterOptionTagSelect,
  DatasetFilterFieldDisabledOption,
  DataSetFilterOperationMap,
}
