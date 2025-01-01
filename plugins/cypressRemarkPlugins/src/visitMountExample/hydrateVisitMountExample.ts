export function hydrateVisitMountExample(code: string) {
  let regex = /-{(.*)}-/gs
  let matches = [...(code.matchAll(regex) || [])][0] || []

  if (matches.length != 2) {
    throw Error(
      'No valid token to replace in visit-mount-example code block: ' + code
    )
  }

  let fullMatch = matches[0]
  let token = matches[1]

  let [visit, mount] = token.split('::')

  if (!visit || !mount) {
    throw Error('Token format invalid in visit-mount-example: ' + token)
  }

  let visitCode = code.replace(fullMatch, visit)
  let mountCode = code.replace(fullMatch, mount)

  return {
    visitCode,
    mountCode,
  }
}
