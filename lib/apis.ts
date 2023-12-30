import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client'

const client = new SuiClient({ url: getFullnodeUrl('devnet') })

export const getSuiDynamicFields = async (
  id: string,
  dynamic_field_name: string,
) => {
  const parent_obj = await client.getObject({
    id,
    options: {
      showContent: true,
    },
  })
  const dynamic_field_key =
    // @ts-ignore
    parent_obj.data?.content?.fields[dynamic_field_name].fields.id.id ?? ''
  if (!dynamic_field_key) {
    throw new Error(`${dynamic_field_name} not found`)
  }

  const collection_keys = await client.getDynamicFields({
    parentId: dynamic_field_key,
  })

  const result = []
  for (const key of collection_keys.data) {
    const row_key = key.name.value ?? ''
    if (row_key) {
      const res = await client.getDynamicFieldObject({
        parentId: dynamic_field_key,
        name: {
          type: '0x2::object::ID',
          value: row_key,
        },
      })
      // @ts-ignore
      const obj = await getSuiObject(res.data?.content?.fields.name)
      // @ts-ignore
      result.push(transformProposal(obj.data?.content?.fields))
    }
  }
  return result
}

export const getSuiObject = (id: string) => {
  return client.getObject({
    id,
    options: {
      showContent: true,
    },
  })
}

export const getOwnedObjects = (owner: string) => {
    return client.getOwnedObjects({
      owner,
      options: {
        showContent: true,
      },
    })
}


export const getSpecificCoin = async (owner: string, coinType: string) => {
  let result
  if (coinType) {
    result = await client.getCoins({
      owner,
      coinType,
    })
  } else {
    result = await client.getCoins({
      owner,
    })
  }
  return result.data
}

export const getAllCoins = async (owner: string) => {
  let result = await client.getAllCoins({
    owner,
  })
  let coins: Record<string, number> = {}
  for (const coin of Array.from(result.data)) {
    if (!coins[coin['coinType']]) {
      coins[coin['coinType']] = parseInt(coin['balance'])
    } else {
      coins[coin['coinType']] += parseInt(coin['balance'])
    }
  }
  return coins
}